import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate = (
  schema: z.ZodTypeAny,
  source: "body" | "params" | "query" = "body"
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }

    (req as any)[source] = result.data;

    next();
  };
};