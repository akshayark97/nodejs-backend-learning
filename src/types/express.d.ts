declare global {
  namespace Express {
    interface Request {
      requestStartTime?: number;
    }
  }
}

export {};
