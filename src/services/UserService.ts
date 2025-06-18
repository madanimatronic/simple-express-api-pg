import { userRepository } from '@/repositories/UserRepository';
import { UserCreationData } from '@/types/User';

class UserService {
  async create(userData: UserCreationData) {
    return await userRepository.create(userData);
  }

  async getAll() {
    return await userRepository.getAll();
  }

  async getById(id: number) {
    if (!id) {
      throw new Error('Id is missing');
    }

    return await userRepository.getById(id);
  }

  // Только полное обновление. Если что-то не указано в userData - оно будет null (логика как при создании)
  async update(id: number, userData: UserCreationData) {
    if (!id) {
      throw new Error('Id is missing');
    }

    return await userRepository.update(id, userData);
  }

  async delete(id: number) {
    if (!id) {
      throw new Error('Id is missing');
    }

    return await userRepository.delete(id);
  }
}

export const userService = new UserService();
