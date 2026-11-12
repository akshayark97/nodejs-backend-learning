import { NextFunction, Request, Response } from "express";

// Log whether the request is GET, POST, PATCH or DELETE.
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();

  console.log(`[REQUEST] ${req.method} ${req.originalUrl}`);

  res.on("finish", () => {
    const duration = Date.now() - startTime;

    console.log(
      `[RESPONSE]: ${req.method} ${req.originalUrl} | ` +
        `Status: ${res.statusCode} | Duration: ${duration}ms`,
    );
  });

  next();
}
