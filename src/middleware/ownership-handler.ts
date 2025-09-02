import { ForbiddenError } from '@/errors/http-errors';
import { PostService } from '@/services/PostService';
import { OwnershipResourceType } from '@/types/middleware/ownership-handler';
import { userJwtPayloadSchema } from '@/validation/auth-validation';
import { coercedIntIdSchema } from '@/validation/common';
import { NextFunction, Request, Response } from 'express';

// Используется только после auth middleware
export const ownershipHandler =
  (postService: PostService) =>
  (resourceIdParamName: string, resourceType: OwnershipResourceType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    // Если id некоторых ресурсов будут иметь другой формат, то можно определять
    // для каждого ресурса индивидуально
    const resourceId = coercedIntIdSchema.parse(
      req.params[resourceIdParamName],
    );
    const { id: userId, roles } = userJwtPayloadSchema.parse(req.user);
    const isAdmin = roles.includes('ADMIN');

    if (isAdmin) {
      next();
      return;
    }

    try {
      switch (resourceType) {
        case 'user':
          if (resourceId !== userId) {
            throw new Error();
          }
          break;

        case 'post':
          {
            const userPosts = await postService.getAllByUserId(userId);

            const userIsOwner =
              userPosts?.some(
                (post) => post.id === resourceId && post.author_id === userId,
              ) ?? false;

            if (!userIsOwner) {
              throw new Error();
            }
          }
          break;
      }

      next();
    } catch {
      throw new ForbiddenError({
        message: 'Access denied. You are not the owner or admin.',
      });
    }
  };
