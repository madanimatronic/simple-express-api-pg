import 'dotenv/config';
// TODO: лучше использовать библиотеку для валидации

const {
  NODE_ENV,
  APP_PORT,
  STATIC_FOLDER_PATH,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
} = process.env;

const appPortNumber = Number(APP_PORT);
const postgresPortNumber = Number(POSTGRES_PORT);

if (
  !NODE_ENV ||
  isNaN(appPortNumber) ||
  !STATIC_FOLDER_PATH ||
  !POSTGRES_HOST ||
  isNaN(postgresPortNumber) ||
  !POSTGRES_USER ||
  !POSTGRES_PASSWORD ||
  !POSTGRES_DB
) {
  throw new Error('Some .env variables are invalid!');
}

export const env = {
  NODE_ENV,
  APP_PORT: appPortNumber,
  STATIC_FOLDER_PATH,
  POSTGRES_HOST,
  POSTGRES_PORT: postgresPortNumber,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
};
