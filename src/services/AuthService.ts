import { AuthUserDto } from '@/dto/AuthUserDto';
import { FullUserDto } from '@/dto/FullUserDto';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '@/errors/http-errors';
import { AuthRepository } from '@/repositories/AuthRepository';
import { UserCreationData, UserFromDB, UserLoginData } from '@/types/User';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from './EmailService';
import { TokenService } from './TokenService';
import { UserService } from './UserService';

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
  ) {}

  // TODO: подумать об уместности названия registerUser
  async registerUser(userData: UserCreationData) {
    const { email, password } = userData;

    const existingUser = await this.userService.getByEmail(email);

    if (existingUser) {
      throw new ConflictError({
        message: `User with email ${email} already exists`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 6);

    const newUser = await this.userService.create({
      ...userData,
      password: hashedPassword,
    });

    const userDto = new AuthUserDto(newUser);

    // Деструктуризация экземпляра класса для большей надёжности
    const tokens = await this.tokenService.createTokensForUser({ ...userDto });

    await this.initiateEmailVerification(newUser);

    // TODO: возможно стоит вместо userDto отправлять
    // более подробный объект данных пользователя (а может и нет)
    return { ...tokens, user: userDto };
  }

  async login(userData: UserLoginData) {
    const { email, password } = userData;

    const user = await this.userService.getByEmail(email);

    if (!user) {
      throw new NotFoundError({
        message: `User with email ${email} doesn't exist`,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError({ message: 'Wrong password' });
    }

    const userDto = new AuthUserDto(user);

    const tokens = await this.tokenService.createTokensForUser({ ...userDto });

    return { ...tokens, user: userDto };
  }

  async verifyEmail(verificationUUID: string) {
    if (!verificationUUID) {
      throw new BadRequestError({ message: 'verificationUUID is missing' });
    }

    const user =
      await this.authRepository.getUserByEmailVerificationUUID(
        verificationUUID,
      );

    if (!user) {
      throw new BadRequestError({ message: 'Invalid verificationUUID' });
    }

    await this.authRepository.deleteEmailVerificationUuidByUserId(user.id);

    const userDto = new FullUserDto(user);

    await this.userService.update(user.id, {
      ...userDto,
      isEmailVerified: true,
    });
  }

  // TODO: если такой параметр избыточен, то передавать хотя бы
  // userId и email
  // private можно убрать при необходимости
  private async initiateEmailVerification(user: UserFromDB) {
    const emailVerificationUUID = uuidv4();

    await this.authRepository.saveEmailVerificationUUID(
      user.id,
      emailVerificationUUID,
    );

    await this.emailService.sendVerificationEmail(
      user.email,
      emailVerificationUUID,
    );
  }
}
