import { Injectable } from '@nestjs/common';

@Injectable()
export class Logger {
  constructor() {}

  log(message: string, context?: string) {
    console.log({
      message,
      context,
    });
  }

  error(message: string, context?: string) {
    console.error({
      message,
      context,
    });
  }

  warn(message: string, context?: string) {
    console.warn({
      message,
      context,
    });
  }

  debug(message: string, context?: string) {
    console.debug({
      message,
      context,
    });
  }

  verbose(message: string, context?: string) {
    console.log({
      message,
      context,
    });
  }
}
