import { ErrorCode, ErrorName } from "./types";

export type BaseErrorType = {
  code: ErrorCode;
  name: ErrorName;
  message: string;
}

export class BaseError extends Error {
  public readonly code: ErrorCode;
  public readonly name: string;
  constructor(error: BaseErrorType) {
    super(error.message);
    this.code = error.code || ErrorCode.INTERNAL_SERVER;
    this.name = error.name.toString();
  }
}
