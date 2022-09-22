import { ErrorCode, ErrorName } from './types';
import { BaseError } from './BaseError';

export class Unauthorized extends BaseError {
  constructor(message = 'Invalid Credentials') {
    super({ name: ErrorName.UNAUTHORIZED, message, code: ErrorCode.UNAUTHORIZED });
  }
}
