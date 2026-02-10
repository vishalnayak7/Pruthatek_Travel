import { Request, Response, NextFunction } from "express";

export function responseFormatter(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  res.success = (
    message: string | null = null,
    data: unknown = null,
    statusCode = 200
  ) => {
    res.status(statusCode).json({
      success: true,
      message,
      timestamp: new Date().toISOString(),
      data,
    });
  };

  res.fail = (
    message: string | null = null,
    statusCode = 400,
    extra?: Record<string, unknown>
  ) => {
    res.status(statusCode).json({
      success: false,
      message,
      timestamp: new Date().toISOString(),
      route: req.originalUrl,
      data: null,
      ...(extra ?? {}),
    });
  };

  next();
}
