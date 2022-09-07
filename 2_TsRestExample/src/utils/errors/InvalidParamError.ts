import { BaseError } from './BaseError';

export class InvalidParamError extends BaseError {
  constructor(message: string) {
    super(message, 400);
  }
}
