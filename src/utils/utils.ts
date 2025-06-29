import fs from 'fs/promises';

export const checkFileExistence = async (fullPath: string) => {
  try {
    await fs.access(fullPath);
    return true;
  } catch (err) {
    return false;
  }
};
