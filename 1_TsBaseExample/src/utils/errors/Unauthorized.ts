import { ErrorCode, ErrorName } from "./types";
import { BaseError } from "./BaseError";

export class UnauthorizedError extends BaseError {
  constructor(message: string) {
    super({ name: ErrorName.UNAUTHORIZED, message, code: ErrorCode.BAD_REQUEST });
  }
}
