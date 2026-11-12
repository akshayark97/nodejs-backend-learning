import type { Request, Response, NextFunction } from "express";

export function responseHeader(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.setHeader("X-App-Name", "task-processing-platform");

  next();
}
