import { z } from 'zod/v4';
import { coercedIntIdSchema, intIdSchema } from './common';

export const postThumbnailSchema = z.string();

export const postFromDbSchema = z.object({
  id: intIdSchema,
  title: z.string(),
  author_id: z.nullable(intIdSchema),
  content: z.string(),
  thumbnail: z.nullable(postThumbnailSchema),
});

export const postSchema = z.object({
  title: z.string(),
  authorId: z.nullable(intIdSchema),
  content: z.string(),
  thumbnail: z.nullable(postThumbnailSchema),
});

// thumbnail указывается отдельно при создании поста, поэтому postCreationSchema его не содержит
export const postCreationSchema = z.object({
  title: z.string(),
  authorId: coercedIntIdSchema,
  content: z.string(),
});

export const postCreationSchemaWithThumbnail = z.intersection(
  postCreationSchema,
  z.object({ thumbnail: z.optional(postThumbnailSchema) }),
);
