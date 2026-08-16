import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateRequest =
  (
    schema: ZodSchema,
    source: "body" | "query" | "params" = "body"
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return next(result.error);
    }
    (req as any).validated = result.data;

    next();
  };