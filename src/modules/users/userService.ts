import { AppError } from "../../utils/AppError";
import { User } from "./userModel"
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export const userService = {

  getMe: async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new AppError("User not presend", 401);
    }
    return user;
  },
  childCount: async (userId: string) => {

    return await User.countDocuments({ parentId: userId })
  },
  createUser: async (
    user: any,
    fullName: string,
    email: string,
    password: string,
    parentId?: string
  ) => {

    let newUserRole: "ADMIN" | "USER";
    let newParentId: string;

    if (user.role === "SUPERADMIN") {

      if (parentId) {
  
          const parentAdmin = await User.findOne({
              _id: parentId,
              role: "ADMIN",
          });
  
          if (!parentAdmin) {
              throw new AppError("Admin not found", 404);
          }
  
          newUserRole = "USER";
          newParentId = parentId;
  
      } else {
  
          newUserRole = "ADMIN";
          newParentId = user.userId;
  
      }
  
  } else if (user.role === "ADMIN") {
  
      newUserRole = "USER";
      newParentId = user.userId;
  
  } else {
      throw new AppError("Unauthorized", 403);
  }

    const emailExist = await User.findOne({ email });

    if (emailExist) {
      throw new AppError("Email already exists", 400);
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashPassword,
      role: newUserRole,
      parentId: newParentId,
    });

    const userObj = newUser.toObject();
    const { password: hashedPassword, ...safeUser } = userObj;

    return safeUser;
  },
  
  getChildren: async (
    currentUser: any,
    query: any
  ) => {

    let parentId = currentUser.userId;

    if (query.parentId) {

      if (currentUser.role === "SUPERADMIN") {

        const admin = await User.findOne({
          _id: query.parentId,
          parentId: currentUser.userId,
          role: "ADMIN",
        });

        if (!admin) {
          throw new AppError("Unauthorized access", 403);
        }

      } else if (currentUser.role === "ADMIN") {

        if (query.parentId !== currentUser.userId) {
          throw new AppError("Unauthorized access", 403);
        }

      }

      parentId = query.parentId;
    }


    const filter: any = {
      parentId: new mongoose.Types.ObjectId(parentId),
    };

    if (query.status === "active") {
      filter.isBlocked = false;
    }

    if (query.status === "blocked") {
      filter.isBlocked = true;
    }


    if (query.q) {
      filter.$or = [
        {
          fullName: {
            $regex: query.q,
            $options: "i",
          },
        },
        {
          email: {
            $regex: query.q,
            $options: "i",
          },
        },
      ];
    }

    const skip = (query.page - 1) * query.limit;


    const result = await User.aggregate([

      {
        $match: filter,
      },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "parentId",
          as: "children",
        },
      },

      // Count children
      {
        $addFields: {
          childrenCount: {
            $size: "$children",
          },
        },
      },

      {
        $project: {
          password: 0,
          __v: 0,
          children: 0,
        },
      },

      // Latest first
      {
        $sort: {
          createdAt: -1,
        },
      },

      {
        $facet: {

          children: [
            {
              $skip: skip,
            },
            {
              $limit: query.limit,
            },
          ],

          pagination: [
            {
              $count: "total",
            },
          ],

        },
      },

    ]);

    const total = result[0]?.pagination[0]?.total || 0;

    return {
      children: result[0].children,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  },
};
