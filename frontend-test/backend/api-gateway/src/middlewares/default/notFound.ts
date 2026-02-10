import { Request, Response, NextFunction } from "express";
import { statusCode } from "../../utils/constants/statusCode.js";

export default function notFound(
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  res.status(statusCode.NOT_FOUND).json({
    success: false,
    message: "Route not found",
    timestamp: new Date().toISOString(),
    data: null,
    route: req.originalUrl,
  });
}
