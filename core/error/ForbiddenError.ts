export default class ForbiddenError extends Error {
  message: string;
  code: number;
  constructor (message: string, code: number) {
    super();

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);

    this.message = message;
    this.code = code;
  }
};
