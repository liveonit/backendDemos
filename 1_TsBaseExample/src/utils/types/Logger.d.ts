/* eslint-disable no-var */
declare type Logger = {
  debug: (data: any) => void;
  log: (data: any) => void;
  info: (data: any, processName?: string) => void;
  success: (data: any, processName?: string) => void;
  title: (title: string) => void;
  warning: (data: any, processName?: string) => void;
  error: (data: any, processName?: string) => void;
}

declare global {
  var logger: Logger;
}

export {};
