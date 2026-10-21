import mongoose from "mongoose";
import { Audit, type AuditAction } from "./auditModel";

export interface CreateAuditInput {
  actorUserId: string | mongoose.Types.ObjectId;
  action: AuditAction;
  targetUserId?: string | mongoose.Types.ObjectId | null;
  metadata?: Record<string, unknown>;
} 

export const auditService = {
  createAudit: async (data: CreateAuditInput) => {
    return Audit.create({
      actorUserId: data.actorUserId,
      action: data.action,
      targetUserId: data.targetUserId ?? null,
      metadata: data.metadata ?? {},
    });
  },

  getRecentAudits: async (actorUserId?: string) => {
    console.log("actorUserId is:",actorUserId);
     if(!actorUserId){
      return 
     }
    const filter = actorUserId ? { actorUserId } : {};
   
    return Audit.find(filter)
      .populate("actorUserId", "fullName email role")
      .populate("targetUserId", "fullName email role")
      .sort({ createdAt: -1 })
      .limit(5);
  },
};
