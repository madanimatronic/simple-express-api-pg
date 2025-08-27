import { AuthUserDto } from '@/dto/AuthUserDto';
import { FullUserDto } from '@/dto/FullUserDto';
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from '@/errors/http-errors';
import { AuthRepository } from '@/repositories/AuthRepository';
import { JWT } from '@/types/auth';
import { UserCreationData, UserFromDB, UserLoginData } from '@/types/User';
import { userJwtPayloadSchema } from '@/validation/auth-validation';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from './EmailService';
import { TokenService } from './TokenService';
import { UserRoleService } from './UserRoleService';
import { UserService } from './UserService';

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
    private readonly userRoleService: UserRoleService,
  ) {}

  // TODO: подумать об уместности названия registerUser
  async registerUser(userData: UserCreationData) {
    const { email, password } = userData;

    const existingUser = await this.userService.getFullUserDataByEmail(email);

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

    try {
      const userRole = 'USER';

      await this.userRoleService.assignRoleToUserByName(newUser.id, userRole);

      const userDto = new AuthUserDto(newUser, [userRole]);

      // Деструктуризация экземпляра класса для большей надёжности
      const tokens = await this.tokenService.createTokensForUser({
        ...userDto,
      });

      const emailVerificationData = {
        id: newUser.id,
        email: newUser.email,
      };

      await this.initiateEmailVerification(emailVerificationData);

      // TODO: возможно стоит вместо userDto отправлять
      // более подробный объект данных пользователя (а может и нет)
      return { ...tokens, user: userDto };
    } catch {
      await this.userService.delete(newUser.id);
      throw new InternalServerError({ message: 'Registration failed' });
    }
  }

  async login(userData: UserLoginData) {
    const { email, password } = userData;

    const user = await this.userService.getFullUserDataByEmail(email);

    if (!user) {
      throw new NotFoundError({
        message: `User with email ${email} doesn't exist`,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError({ message: 'Wrong password' });
    }

    const userRoles = (
      await this.userRoleService.getUserNamedRoles(user.id)
    ).map((role) => role.name);

    const userDto = new AuthUserDto(user, userRoles);

    const tokens = await this.tokenService.createTokensForUser({ ...userDto });

    return { ...tokens, user: userDto };
  }

  async logout(refreshToken: JWT) {
    return await this.tokenService.deleteRefreshToken(refreshToken);
  }

  async logoutByUserId(userId: number) {
    return await this.tokenService.deleteRefreshTokenByUserId(userId);
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

  async refreshTokens(refreshToken: JWT) {
    if (!refreshToken) {
      throw new UnauthorizedError({ message: 'Refresh token is missing' });
    }

    const tokenPayload = this.tokenService.decodeToken(refreshToken);
    const userPayload = userJwtPayloadSchema.parse(tokenPayload);

    // Получаем актуальные данные пользователя, т.к. данные из токена могли устареть
    const user = await this.userService.getFullUserDataById(userPayload.id);

    if (!user) {
      throw new UnauthorizedError({
        message: "User by id extracted from token doesn't exist",
      });
    }

    const userRoles = (
      await this.userRoleService.getUserNamedRoles(user.id)
    ).map((role) => role.name);

    const userDto = new AuthUserDto(user, userRoles);

    return await this.tokenService.refreshTokensForUser(
      { ...userDto },
      refreshToken,
    );
  }

  async initiateEmailVerification(user: Pick<UserFromDB, 'id' | 'email'>) {
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
