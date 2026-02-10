// src/types/responseFormatter.d.ts
import { Request, Response, NextFunction } from "express";

declare module "./middlewares/default/responseFormatter.js" {
  export function responseFormatter(
    req: Request,
    res: Response,
    next: NextFunction
  ): void;
}
