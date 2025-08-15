import { z } from 'zod/v4';
import { intIdSchema } from './common';

export const roleNameSchema = z.union([z.literal('USER'), z.literal('ADMIN')]);

export const roleFromDbSchema = z.object({
  id: intIdSchema,
  name: roleNameSchema,
});

// Если в roles появятся ещё поля, то roleSchema нужно будет переделать в z.object
export const roleSchema = roleNameSchema;

export const userRoleFromDbSchema = z.object({
  id: intIdSchema,
  user_id: intIdSchema,
  role_id: intIdSchema,
});

// TODO: может вместо assign и roleCreation подобрать названия поточнее
export const roleCreationSchema = z.object({
  name: roleNameSchema,
});

export const assignRoleSchema = z.object({
  roleId: intIdSchema,
});

export const assignMultipleRolesSchema = z.object({
  roleId: z.array(intIdSchema),
});
