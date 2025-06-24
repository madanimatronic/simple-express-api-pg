import { env } from '@/config/env';
import { fileService } from '@/services/FileService';
import mockFS from 'mock-fs';
import path from 'node:path';

const testUUID = 'ca1debbd-fa1d-4e48-9d46-a4e02eba8515';
const testFileName = `${testUUID}.jpg`;

jest.mock('uuid', () => ({
  v4: () => 'ca1debbd-fa1d-4e48-9d46-a4e02eba8515',
}));

describe('fileService', () => {
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

    it('should return filename after creating file', async () => {
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
  });
});
