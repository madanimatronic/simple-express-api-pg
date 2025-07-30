import { env } from '@/config/env';
import { BadRequestError } from '@/errors/http-errors';
import { TokenRepository } from '@/repositories/TokenRepository';
import {
  JWT,
  JWTLifetimeString,
  JWTPayload,
  UserJWTPayload,
} from '@/types/auth';
import jwt from 'jsonwebtoken';

export class TokenService {
  // Если TokenService всё же не должен будет отвечать за сохранение/удаление и т.д.,
  // то вынести это в AuthService
  // Важно следить за тем, чтобы класс не брал на себя слишком много ответственностей
  constructor(
    private readonly tokenRepository: TokenRepository,
    // private readonly userService: UserService,
  ) {}

  async createTokensForUser(userPayloadData: UserJWTPayload) {
    const tokens = this.generateTokens(userPayloadData);

    await this.saveRefreshToken(userPayloadData.id, tokens.refreshToken);

    return tokens;
  }

  generateTokens(payload: JWTPayload) {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
    };
  }

  generateAccessToken(payload: JWTPayload) {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_LIFETIME as JWTLifetimeString,
    });
  }

  generateRefreshToken(payload: JWTPayload) {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_REFRESH_LIFETIME as JWTLifetimeString,
    });
  }

  // TODO (feat): продумать важный механизм:
  // - При текущем подходе если пользователь зайдёт с другого устройства,
  // то получит новый refresh токен, а старый токен перезапишется в БД,
  // что приведёт к тому, что пользователя выкинет с прошлого устройства
  // и ему придётся заново логиниться.
  // - Чтобы такое не происходило можно сохранять по несколько токенов
  // для одного пользователя, но нужно учесть, что токены умирают со временем
  // и их надо вычищать из БД.
  // - (опционально) продумать как защититься от флуда когда пользователь отправляет
  // кучу запросов на логин, забивая тем самым БД refresh токенами
  // Решение:
  // 1) Хранить для refresh токена дату создания в БД
  // 2) Лимит на количество логинов в ед. времени для конкретного email
  // (пришёл логин -> смотрим дату создания последнего токена юзера и
  // сверяем с текущей датой -> ...действия)
  // 3) Лимит на количество активных refresh токенов
  // (пришёл логин -> смотрим количество токенов юзера и
  // сверяем с лимитом -> если лимит достигнут - удаляем самый старый токен
  // и записываем новый, иначе просто добавляем новый)
  async saveRefreshToken(userId: number, refreshToken: JWT) {
    const existingToken = await this.tokenRepository.getByUserId(userId);

    // TODO: подумать, действительно ли нужно что-то возвращать из данного метода
    if (!existingToken) {
      return await this.tokenRepository.create(userId, refreshToken);
    }

    return await this.tokenRepository.updateByUserId(userId, refreshToken);
  }

  async deleteRefreshToken(refreshToken: JWT) {
    if (!refreshToken) {
      throw new BadRequestError({ message: 'Refresh token is missing' });
    }

    return await this.tokenRepository.delete(refreshToken);
  }

  async deleteRefreshTokenByUserId(id: number) {
    if (!id) {
      throw new BadRequestError({ message: 'User id is missing' });
    }

    return await this.tokenRepository.deleteByUserId(id);
  }
}
