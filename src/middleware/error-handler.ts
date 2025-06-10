import { NextFunction, Request, Response } from 'express';

export const errorHandler =
  (logErrors = false, defaultHandlerDisabled = false) =>
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return defaultHandlerDisabled ? undefined : next(err);
    }
    if (logErrors) {
      console.error(err);
    }
    res.status(500).send({ error: 'Internal Server Error' });
  };
