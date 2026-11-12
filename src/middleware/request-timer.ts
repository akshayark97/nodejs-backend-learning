import type { NextFunction, Request, Response } from "express";

export function requestTimer(req: Request, res: Response, next: NextFunction) {
  const startTime = process.hrtime.bigint();

  res.on("finish", () => {
    const endTime = process.hrtime.bigint();

    const durationMs = Number(endTime - startTime) / 1_000_000;

    console.log(
      `[TIMER] ${req.method} ${req.originalUrl} took ${durationMs.toFixed(2)}ms`,
    );
  });
  next();
}
