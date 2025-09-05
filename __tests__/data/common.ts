import { env } from '@/config/env';
import jwt from 'jsonwebtoken';

export const testUUID = 'ca1debbd-fa1d-4e48-9d46-a4e02eba8515';

// Тестовый access токен для запросов. Может перестать работать,
// если поменяется логика авторизации
// Также обратить внимание, что это ADMIN-токен.
// Если требуется USER, или конкретный id/email и т.д.,
// то надо будет создать токен локально
export const testAccessJWT = jwt.sign(
  {
    id: 9999,
    email: 'testuser124712984@test.com',
    isEmailVerified: true,
    roles: ['ADMIN'],
  },
  env.JWT_ACCESS_SECRET,
  {
    expiresIn: '1y',
  },
);
