import { ErrorCode, ErrorName } from "./types";
import { BaseError } from "./BaseError";

export class BadRequest extends BaseError {
  constructor(message: string) {
    super({ errorName: ErrorName.BAD_REQUEST, message, statusCode: ErrorCode.BAD_REQUEST });
  }
}
