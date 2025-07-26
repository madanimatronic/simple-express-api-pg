import { HttpError } from '@/errors/http-errors';
import { HttpErrorData } from '@/types/errors';
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

    const { status, message, issues } = getErrorData(err);

    const response: { error: string; issues?: unknown[] } = { error: message };

    if (issues) {
      response.issues = issues;
    }

    res.status(status).send(response);
  };

function getErrorData(err: Error): HttpErrorData<unknown[]> {
  if (err instanceof HttpError) {
    const errorData: HttpErrorData = {
      status: err.status,
      message: err.message,
      issues: err.issues,
    };

    return errorData;
  }

  if (err instanceof ZodError) {
    return {
      status: 400,
      message: 'Invalid Input',
      issues: err.issues,
    };
  }

  return {
    status: 500,
    message: 'Internal Server Error',
  };
}
