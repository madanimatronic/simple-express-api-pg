import { ForbiddenError } from '@/errors/http-errors';
import { UserService } from '@/services/UserService';
import { userJwtPayloadSchema } from '@/validation/auth-validation';
import { coercedIntIdSchema } from '@/validation/common';
import { partialUserSchema } from '@/validation/user-validation';
import { Request, Response } from 'express';

export class UserController {
  constructor(private readonly userService: UserService) {}

  // TODO: можно прикрутить фичу, чтобы админы получали больше инфы о пользователях
  async getAll(req: Request, res: Response) {
    const users = await this.userService.getAllUsersPublicData();

    res.json(users);
  }

  async getById(req: Request, res: Response) {
    const id = coercedIntIdSchema.parse(req.params.id);

    const user = await this.userService.getPublicUserDataById(id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  }

  async update(req: Request, res: Response) {
    const id = coercedIntIdSchema.parse(req.params.id);

    const { id: authorizedUserId, roles } = userJwtPayloadSchema.parse(
      req.user,
    );

    const isAdmin = roles.includes('ADMIN');

    if (id !== authorizedUserId && !isAdmin) {
      throw new ForbiddenError({ message: 'Access denied' });
    }

    const userData = partialUserSchema.parse(req.body);

    const updateData = isAdmin
      ? userData
      : { name: userData.name, about: userData.about };

    const updatedUser = await this.userService.update(id, updateData);

    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // TODO: можно ограничить данные в ответе для не админов или для всех,
    // используя PublicUserDto
    res.json(updatedUser);
  }

  async delete(req: Request, res: Response) {
    const id = coercedIntIdSchema.parse(req.params.id);

    const { id: authorizedUserId, roles } = userJwtPayloadSchema.parse(
      req.user,
    );

    const isAdmin = roles.includes('ADMIN');

    if (id !== authorizedUserId && !isAdmin) {
      throw new ForbiddenError({ message: 'Access denied' });
    }

    const deletedUser = await this.userService.delete(id);

    if (!deletedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(deletedUser);
  }
}
