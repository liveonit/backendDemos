import { BaseError } from './BaseError';

export class InvalidDataError extends BaseError {
  constructor(message: string) {
    super(message, 400);
  }
}
