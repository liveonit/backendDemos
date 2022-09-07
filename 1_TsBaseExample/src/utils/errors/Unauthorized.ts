import { ErrorCode, ErrorName } from "./types";
import { BaseError } from "./BaseError";

export class UnauthorizedError extends BaseError {
  constructor(message: string) {
    super({ errorName: ErrorName.UNAUTHORIZED, message, statusCode: ErrorCode.BAD_REQUEST });
  }
}
