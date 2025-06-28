import { UserService } from '@/services/UserService';
import { coercedIntIdSchema } from '@/validation/common';
import { userCreationSchema } from '@/validation/user-validation';
import { Request, Response } from 'express';

export class UserController {
  constructor(private readonly userService: UserService) {}

  async create(req: Request, res: Response) {
    const userData = userCreationSchema.parse(req.body);

    const newUser = await this.userService.create(userData);

    res.json(newUser);
  }

  async getAll(req: Request, res: Response) {
    const users = await this.userService.getAll();

    res.json(users);
  }

  async getById(req: Request, res: Response) {
    const id = coercedIntIdSchema.parse(req.params.id);

    const user = await this.userService.getById(id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  }

  async update(req: Request, res: Response) {
    const id = coercedIntIdSchema.parse(req.params.id);

    const userData = userCreationSchema.parse(req.body);

    const updatedUser = await this.userService.update(id, userData);

    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(updatedUser);
  }

  async delete(req: Request, res: Response) {
    const id = coercedIntIdSchema.parse(req.params.id);

    const deletedUser = await this.userService.delete(id);

    if (!deletedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(deletedUser);
  }
}
