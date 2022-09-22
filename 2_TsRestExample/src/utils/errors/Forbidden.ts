import { ErrorCode, ErrorName } from './types';
import { BaseError } from './BaseError';

export class Forbidden extends BaseError {
  constructor(message = 'Invalid Permissions') {
    super({ name: ErrorName.FORBIDDEN, message, code: ErrorCode.FORBIDDEN });
  }
}
