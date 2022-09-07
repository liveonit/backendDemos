/* eslint-disable no-var */
declare interface Logger {
  debug: (data: any) => void;
  log: (data: any) => void;
  logInfo: (data: any, processName?: string) => void;
  logSuccess: (data: any, processName?: string) => void;
  logTitle: (title: string) => void;
  logWarning: (data: any, processName?: string) => void;
  logError: (data: any, processName?: string) => void;
}

declare global {
  var logger: Logger;
}

export {};
