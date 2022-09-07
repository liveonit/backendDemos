import { ErrorCode, ErrorName } from "./types";
import { BaseError } from "./BaseError";

export class InternalServer extends BaseError {
  constructor(message: string) {
    super({ errorName: ErrorName.INTERNAL_SERVER, message, statusCode: ErrorCode.INTERNAL_SERVER });
  }
}
