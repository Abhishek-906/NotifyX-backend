import mongoose, { Schema, Document } from "mongoose";
import { boolean } from "zod";

export interface INotification extends Document{
  userId:  mongoose.Types.ObjectId;
  title:string;
  message: string;
  isRead: boolean;
  createAt: Date;
}

const notificationSchema = new mongoose.Schema<INotification>({
    userId: {
      type: Schema.Types.ObjectId,
      ref:"User",
      required:true
    },
    title:{
      type:String,
      required:true
    },
    message:{
      type:String,
      required:true
    },
    isRead:{
      type:Boolean,
      default:false
    },
},{
  timestamps: true
});

export const Notification = mongoose.model<INotification>("Notification", notificationSchema)