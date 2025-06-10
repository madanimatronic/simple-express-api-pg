import { userService } from '@/services/UserService';
import { Request, Response } from 'express';

class UserController {
  async create(req: Request, res: Response) {
    const user = req.body;

    const newUser = await userService.create(user);

    res.json(newUser);
  }

  async getAll(req: Request, res: Response) {
    const users = await userService.getAll();

    res.json(users);
  }

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);

    const user = await userService.getById(id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  }

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const userData = req.body;

    const updatedUser = await userService.update(id, userData);

    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(updatedUser);
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);

    const deletedUser = await userService.delete(id);

    if (!deletedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(deletedUser);
  }
}

export const userController = new UserController();
