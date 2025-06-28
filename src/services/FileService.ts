import { env } from '@/config/env';
import { UploadedFile } from 'express-fileupload';
import fs from 'fs/promises';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';

export class FileService {
  async saveFile(file: UploadedFile) {
    const fileExt = path.extname(file.name);
    const fileName = uuidv4() + fileExt;
    const filePath = path.resolve(env.STATIC_FOLDER_PATH, fileName);

    await file.mv(filePath);

    return fileName;
  }

  async deleteFile(fileName: string) {
    // Если по каким-то причинам файл отсутствует, то будет ошибка.
    // Например, если при удалении поста из БД попытаться удалить его картинку,
    // которой уже не существует, то будет ошибка и пост не сможет удалиться.
    // Поэтому стоит перехватывать ошибку, чтобы повысить надёжность
    try {
      const filePath = path.resolve(env.STATIC_FOLDER_PATH, fileName);
      await fs.rm(filePath);
      return true;
    } catch (err) {
      console.error(`Error deleting file '${fileName}'\n`, err);
      return false;
    }
  }

  async updateFile(fileName: string | undefined | null, newFile: UploadedFile) {
    if (fileName) {
      await this.deleteFile(fileName);
    }
    const newFileName = await this.saveFile(newFile);
    return newFileName;
  }
}
