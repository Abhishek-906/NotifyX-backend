import mongoose, { Document, Schema } from "mongoose";

export type AuditAction =
  | "ACCOUNT_CREATED"
  | "ACCOUNT_BLOCKED"
  | "ACCOUNT_UNBLOCKED"
  | "NOTIFICATION_SENT"
  | "BULK_NOTIFICATION_SENT";

export interface IAudit extends Document {
  actorUserId: mongoose.Types.ObjectId;
  action: AuditAction;
  targetUserId: mongoose.Types.ObjectId | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const auditSchema = new Schema<IAudit>(
  {
    actorUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: [
        "ACCOUNT_CREATED",
        "ACCOUNT_BLOCKED",
        "ACCOUNT_UNBLOCKED",
        "NOTIFICATION_SENT",
        "BULK_NOTIFICATION_SENT",
      ],
      required: true,
    },
    targetUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

export const Audit = mongoose.model<IAudit>("Audit", auditSchema);
