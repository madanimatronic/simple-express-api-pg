import { NextFunction, Request, Response } from 'express';

export type InitializedOwnershipHandler = (
  resourceIdParamName: string,
  resourceType: OwnershipResourceType,
) => (req: Request, res: Response, next: NextFunction) => Promise<void>;

export type OwnershipResourceType = 'user' | 'post';
