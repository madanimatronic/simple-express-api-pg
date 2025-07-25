export class HttpError extends Error {
  constructor(
    public status: number,
    public message: string,
    // TODO: errors используется для того, чтобы передать туда детали ошибок
    // например, ошибка при парсинге body -> в errors можно передать
    // объекты из error.issues при обработке ошибки zod
    // см. (https://zod.dev/basics?id=handling-errors)
    // Подумать, нужен ли errors на самом деле?
    public errors: string[] = [],
  ) {
    super(message);
  }
}

export class InternalServerError extends HttpError {
  constructor() {
    super(500, 'Internal Server Error');
  }
}

export class BadRequestError extends HttpError {
  constructor() {
    super(400, 'Bad Request');
  }
}

export class UnauthorizedError extends HttpError {
  constructor() {
    super(401, 'Unauthorized');
  }
}
