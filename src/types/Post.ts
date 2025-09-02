import {
  postCreationSchema,
  postCreationSchemaWithThumbnail,
  postFromDbSchema,
  postSchema,
  postTextContentSchema,
  postThumbnailSchema,
} from '@/validation/post-validation';
import { z } from 'zod/v4';

export type PostFromDB = z.infer<typeof postFromDbSchema>;
export type Post = z.infer<typeof postSchema>;
export type PostTextContentSchema = z.infer<typeof postTextContentSchema>;
export type PostCreationData = z.infer<typeof postCreationSchema>;
export type PostCreationDataWithThumbnail = z.infer<
  typeof postCreationSchemaWithThumbnail
>;
export type PostThumbnail = z.infer<typeof postThumbnailSchema>;
