import { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";

export const validateRequest =
  (zodSchema: ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Support both JSON bodies and multipart/form-data where payload is sent under "data"
      let candidateBody: unknown = req.body ?? {};

      // If multipart/form-data sent with a JSON string under body.data
      if (
        candidateBody &&
        typeof candidateBody === "object" &&
        (candidateBody as Record<string, unknown>).hasOwnProperty("data")
      ) {
        const data = (candidateBody as Record<string, unknown>)["data"];
        if (typeof data === "string" && data.trim()) {
          candidateBody = JSON.parse(data);
        }
      }

      // Our zod schemas expect an object with a top-level "body" key
      const parsed = await zodSchema.parseAsync({ body: candidateBody });
      req.body = (parsed as { body: unknown }).body as Record<string, unknown>;
      next();
    } catch (error) {
      next(error);
    }
  };
