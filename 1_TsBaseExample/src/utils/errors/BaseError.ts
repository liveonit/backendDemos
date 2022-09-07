import { ErrorCode, ErrorName } from "./types";

export type BaseErrorType = {
  statusCode: ErrorCode;
  errorName: ErrorName;
  message: string;
}

export class BaseError extends Error {
  public readonly statusCode: ErrorCode;
  public readonly errorName: ErrorName;
  constructor(error: BaseErrorType) {
    super(error.message);
    this.statusCode = error.statusCode | ErrorCode.INTERNAL_SERVER;
    this.errorName = error.errorName;
  }
}
