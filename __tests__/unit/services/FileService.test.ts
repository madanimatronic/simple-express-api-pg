import { env } from '@/config/env';
import { FileService } from '@/services/FileService';
import mockFS from 'mock-fs';
import path from 'node:path';
import { testUUID } from '../../data/common';
import { testFileName } from '../../data/file-data';

const mockFile = {
  name: 'testfile.jpg',
  mv: jest.fn(async (path: string) => {}),
  encoding: '7bit',
  mimetype: 'image/jpeg',
  data: Buffer.from([123, 123, 123]),
  tempFilePath: '',
  truncated: false,
  size: 123,
  md5: '10295e3c1853d6840a72a9db62f2051c',
};

const uuidv4Mock = jest.fn();
jest.mock('uuid', () => ({
  // Данная функция-обертка нужна чтобы избежать ошибок вида
  // "Cannot access ... before initialization"
  // Это обусловлено порядком выполнения кода и всплытием jest.mock
  v4: () => {
    return uuidv4Mock.mockImplementation(() => testUUID)();
  },
}));

describe('fileService', () => {
  const fileService = new FileService();

  beforeEach(() => {
    mockFS({
      [path.resolve(env.STATIC_FOLDER_PATH)]: {
        [testFileName]: Buffer.from([12, 21, 2, 1, 2, 4, 2]),
      },
    });
  });

  afterEach(() => {
    mockFS.restore();
    jest.resetAllMocks();
  });

  // Проверка работы с файловой системой затруднена,
  // т.к. нельзя получить метод .mv(), он есть только
  // у объекта UploadedFile, который получается из запроса
  describe('saveFile', () => {
    it('should return file name after creating file', async () => {
      const fileName = await fileService.saveFile(mockFile);

      expect(mockFile.mv).toHaveBeenCalledTimes(1);
      expect(fileName).toBe(testFileName);
    });
  });

  describe('deleteFile', () => {
    it('should delete file and return true', async () => {
      const result = await fileService.deleteFile(testFileName);

      expect(result).toBe(true);
    });

    it('should return false when attempting to delete a non-existent file', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});

      const result = await fileService.deleteFile('non-existent.png');

      expect(result).toBe(false);
    });
  });

  describe('updateFile', () => {
    it('should delete old file and return new file name', async () => {
      const newTestUUID = '3cf517fa-8965-45bc-96e1-7dd8faed17d1';
      // Ф-ции, определённые через mockImplementationOnce имеют приоритет при вызове мокнутой функции
      uuidv4Mock.mockImplementationOnce(() => newTestUUID);

      const fileName = await fileService.updateFile(testFileName, mockFile);

      expect(fileName).toBe(`${newTestUUID}.jpg`);
    });
  });
});
