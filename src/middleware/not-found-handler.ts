import { NextFunction, Request, Response } from 'express';

// Подключается в конце маршрутов, поэтому next не используется
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(404).json({ error: 'Not Found' });
};
