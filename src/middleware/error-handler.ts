import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod/v4';

export const errorHandler =
  (logErrors = false, defaultHandlerDisabled = false) =>
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return defaultHandlerDisabled ? undefined : next(err);
    }
    if (logErrors) {
      console.error(err);
    }

    const statusCode = getErrorStatus(err);
    const message = getErrorMessage(err);

    res.status(statusCode).send({ error: message });
  };

function getErrorStatus(err: Error): number {
  if (err instanceof ZodError) return 400;
  return 500;
}

function getErrorMessage(err: Error): string {
  if (err instanceof ZodError) return 'Invalid Input';
  return 'Internal Server Error';
}
