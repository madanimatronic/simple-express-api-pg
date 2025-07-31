import 'express';
import { UserJWTPayload } from '../auth';

// declaration merging для добавления поля user в Request
declare module 'express' {
  interface Request {
    user?: UserJWTPayload;
  }
}
