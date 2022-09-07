import { BaseError } from './BaseError';

export class NotFoundError extends BaseError {
  constructor() {
    super('Requested Resource Not Found', 404);
  }
}
