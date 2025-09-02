import { NextFunction, Request, Response } from 'express';
import { RoleName } from '../role';

export type RoleHandler = (
  allowedRoles: RoleName[],
) => (req: Request, res: Response, next: NextFunction) => void;
