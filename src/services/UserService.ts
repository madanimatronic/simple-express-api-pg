import { UserRepository } from '@/repositories/UserRepository';
import { UserCreationData } from '@/types/User';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(userData: UserCreationData) {
    return await this.userRepository.create(userData);
  }

  async getAll() {
    return await this.userRepository.getAll();
  }

  async getById(id: number) {
    if (!id) {
      throw new Error('Id is missing');
    }

    return await this.userRepository.getById(id);
  }

  // Только полное обновление. Если что-то не указано в userData - оно будет null (логика как при создании)
  async update(id: number, userData: UserCreationData) {
    if (!id) {
      throw new Error('Id is missing');
    }

    return await this.userRepository.update(id, userData);
  }

  async delete(id: number) {
    if (!id) {
      throw new Error('Id is missing');
    }

    return await this.userRepository.delete(id);
  }
}
