import {
  CustomErrorIssues,
  HttpErrorData,
  PartialDescriptiveHttpErrorData,
} from '@/types/errors';

export class HttpError extends Error implements HttpErrorData {
  constructor(
    public status: number,
    public message: string,
    public issues?: CustomErrorIssues,
  ) {
    super(message);
  }
}

export class BadRequestError extends HttpError {
  constructor(errorData?: PartialDescriptiveHttpErrorData) {
    const { message = 'Bad Request', issues } = errorData ?? {};
    super(400, message, issues);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(errorData?: PartialDescriptiveHttpErrorData) {
    const { message = 'Unauthorized', issues } = errorData ?? {};
    super(401, message, issues);
  }
}

export class NotFoundError extends HttpError {
  constructor(errorData?: PartialDescriptiveHttpErrorData) {
    const { message = 'Not Found', issues } = errorData ?? {};
    super(404, message, issues);
  }
}

export class ConflictError extends HttpError {
  constructor(errorData?: PartialDescriptiveHttpErrorData) {
    const { message = 'Conflict Error', issues } = errorData ?? {};
    super(409, message, issues);
  }
}

export class InternalServerError extends HttpError {
  constructor(errorData?: PartialDescriptiveHttpErrorData) {
    const { message = 'Internal Server Error', issues } = errorData ?? {};
    super(500, message, issues);
  }
}
