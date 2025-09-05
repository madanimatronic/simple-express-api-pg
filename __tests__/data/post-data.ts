import { env } from '@/config/env';
import path from 'node:path';
import { testFileName } from './file-data';

export const testPostTextCreationData = {
  title: 'test post',
  content: 'test content',
};

// Полный ожидаемый путь для сохраненного файла,
// полученного из запроса при создании поста
export const createdThumbnailFilePath = path.resolve(
  env.STATIC_FOLDER_PATH,
  testFileName,
);
