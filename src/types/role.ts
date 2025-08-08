import {
  roleFromDbSchema,
  roleNameSchema,
  roleSchema,
  userRoleFromDbSchema,
} from '@/validation/role-validation';
import { z } from 'zod/v4';

export type RoleName = z.infer<typeof roleNameSchema>;
export type RoleFromDB = z.infer<typeof roleFromDbSchema>;
// Используется при получении ролей у пользователя
export type RoleNameFromDB = Pick<RoleFromDB, 'name'>;
export type Role = z.infer<typeof roleSchema>;

export type UserRoleFromDB = z.infer<typeof userRoleFromDbSchema>;
