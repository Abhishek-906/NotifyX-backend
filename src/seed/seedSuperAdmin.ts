import { User } from "../modules/users/userModel";
import bcrypt from "bcryptjs";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      role: "SUPERADMIN",
    });

    if (isSuperAdminExist) {
      return;
    }

    const plainPassword = process.env.SUPERADMIN_PASSWORD;
    if (!plainPassword) {
      throw new Error("SUPERADMIN_PASSWORD is not defined");
    }
    const email = process.env.SUPERADMIN_EMAIL;

    if (!email) {
      throw new Error("SUPERADMIN_EMAIL is not defined");
    }
    const hashPassword = await bcrypt.hash(plainPassword, 10);

    const superAdmin = await User.create({
      fullName: "superadmin",
      role: "SUPERADMIN",
      password: hashPassword,
      email: email,
    }); 

    console.log("Super admin created successfully");
  } catch (err) {
    console.log("Issue while creating superadmin: ", err);
  }
};
