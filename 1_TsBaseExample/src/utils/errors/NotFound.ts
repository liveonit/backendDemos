import { ErrorCode, ErrorName } from "./types";
import { BaseError } from "./BaseError";

export class NotFound extends BaseError {
  constructor(message: string) {
    super({ errorName: ErrorName.NOT_FOUND, message, statusCode: ErrorCode.NOT_FOUND });
  }
}
