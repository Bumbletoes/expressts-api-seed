import { RequestHandler } from 'express';
import * as fs from 'fs';
import * as morgan from 'morgan';
import * as winston from 'winston';
import * as dailyRotateFileTransport from 'winston-daily-rotate-file';
import { Config } from '../../config';

/**
 * Logger
 * Created By: Levi McPhetridge
 * Basic wrapper for a singleton logger. Currently set up to use Winston.
 */
export class Logger {
  public static getInstance(): Logger {
    return Logger.instance;
  }
  private static instance: Logger = new Logger();
  private logger: any;
  private requestLogger: any;
  private requestErrorLogger: any;

  constructor() {
    if (Logger.instance) {
      throw new Error('The Logger is a singleton class and cannot be created!');
    }
    Logger.instance = this;
    const logFile: string = Config.logger.logFile;
    const logLevel: string = Config.logger.defaultLevel;
    const requestsFile: string = Config.logger.requestsFile;
    const requestErrorFile: string = Config.logger.requestErrorFile;
    const fileDatePattern: string = Config.logger.fileDatePattern;
    const timestampFormat = () => (new Date()).toLocaleTimeString();

    let transports = [
      new (winston.transports.Console)({
        timestamp: timestampFormat,
        colorize: true,
        level: logLevel,
      }),
      new (dailyRotateFileTransport)({
        name: logFile,
        level: logLevel,
        timestamp: timestampFormat,
        datePattern: fileDatePattern,
        filename: logFile,
      })];

    if (!fs.existsSync(Config.logger.logDir)) {
      fs.mkdirSync(Config.logger.logDir);
    }

    this.logger = new winston.Logger();
    this.logger.configure({
      transports,
    });

    this.requestLogger = new winston.Logger();
    this.requestLogger.configure({
      transports: [
        new (dailyRotateFileTransport)({
          name: requestsFile,
          level: 'info',
          timestamp: timestampFormat,
          datePattern: fileDatePattern,
          filename: requestsFile,
        }),
      ],
    });

    this.requestErrorLogger = new winston.Logger();
    this.requestErrorLogger.configure({
      transports: [
        new (dailyRotateFileTransport)({
          name: requestErrorFile,
          level: 'error',
          timestamp: timestampFormat,
          datePattern: fileDatePattern,
          filename: requestErrorFile,
        }),
      ],
    });

    this.requestLogger.stream = {
      write: (message, encoding) => {
        this.requestLogger.info(message);
      },
    };

    this.requestErrorLogger.stream = {
      write: (message, encoding) => {
        this.requestErrorLogger.error(message);
      },
    };
  }

  public getRequestLogger(): RequestHandler {
    return morgan(Config.logger.requestLogFormat, {
      skip: (req, res) => {
        return res.statusCode > 400;
      },
      stream: this.requestLogger.stream,
    });
  }

  public getRequestErrorLogger(): RequestHandler {
    return morgan(Config.logger.requestLogFormat, {
      skip: (req, res) => {
        return res.statusCode < 400;
      },
      stream: this.requestErrorLogger.stream,
    });
  }

  public info(...arg: any[]) {
    this.logger.info(arg);
  }

  public debug(...arg: any[]) {
    this.logger.debug(arg);
  }

  public warn(...arg: any[]) {
    this.logger.warn(arg);
  }

  public error(...arg: any[]) {
    this.logger.error(arg, { stackTrace: new Error().stack });
  }

  public setLogLevel(logLevel: string) {
    for (let transport in this.logger.transports) {
      if (this.logger.transports.hasOwnProperty(transport)) {
        this.logger.transports[transport].level = logLevel;
      }
    }
  }
}
