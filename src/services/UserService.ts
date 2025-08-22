import { PublicUserDto } from '@/dto/PublicUserDto';
import { BadRequestError } from '@/errors/http-errors';
import { UserRepository } from '@/repositories/UserRepository';
import { Email } from '@/types/auth';
import { PartialUser, UserCreationData } from '@/types/User';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(userData: UserCreationData) {
    return await this.userRepository.create(userData);
  }

  async getAllUsersFullData() {
    return await this.userRepository.getAll();
  }

  async getAllUsersPublicData() {
    const fullUsersData = await this.userRepository.getAll();

    const publicUsersData = fullUsersData.map((userData) => ({
      ...new PublicUserDto(userData),
    }));

    return publicUsersData;
  }

  async getFullUserDataById(id: number) {
    if (!id) {
      throw new BadRequestError({ message: 'Id is missing' });
    }

    return await this.userRepository.getById(id);
  }

  async getPublicUserDataById(id: number) {
    if (!id) {
      throw new BadRequestError({ message: 'Id is missing' });
    }

    const fullUserData = await this.userRepository.getById(id);

    const result = fullUserData && { ...new PublicUserDto(fullUserData) };

    return result;
  }

  async getFullUserDataByEmail(email: Email) {
    if (!email) {
      throw new BadRequestError({ message: 'Email is missing' });
    }

    return await this.userRepository.getByEmail(email);
  }

  async update(id: number, userData: PartialUser) {
    if (!id) {
      throw new BadRequestError({ message: 'Id is missing' });
    }

    return await this.userRepository.update(id, userData);
  }

  async delete(id: number) {
    if (!id) {
      throw new BadRequestError({ message: 'Id is missing' });
    }

    return await this.userRepository.delete(id);
  }
}
