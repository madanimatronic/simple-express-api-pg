import {
  postCreationSchema,
  postCreationSchemaWithThumbnail,
  postSchema,
  postThumbnailSchema,
} from '@/validation/post-validation';
import { z } from 'zod/v4';

export type Post = z.infer<typeof postSchema>;
export type PostCreationData = z.infer<typeof postCreationSchema>;
export type PostCreationDataWithThumbnail = z.infer<
  typeof postCreationSchemaWithThumbnail
>;
export type PostThumbnail = z.infer<typeof postThumbnailSchema>;
