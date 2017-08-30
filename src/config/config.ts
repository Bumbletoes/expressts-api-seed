import * as path from 'path';
/* tslint:disable */
const config = require(path.join(__dirname, `./config.${process.env.NODE_ENV || "development"}.json`));
/* tslint:enable */

export interface ILoggerConfig {
  logDir: string;
  logFile: string;
  requestsFile: string;
  requestErrorFile: string;
  requestLogFormat: string;
  defaultLevel: string;
  fileDatePattern: string;
}

export interface IDatabaseConfig {
  host: string;
  user: string;
  password: string;
  dbName: string;
}

export interface IServerConfig {
  port: number;
  jwtSecret: string;
  jwtExpiration: string;
}

export interface IConfig {
  server: IServerConfig;
  logger: ILoggerConfig;
  database: IDatabaseConfig;
}

export class Config {
  public static server: IServerConfig = config.server;
  public static logger: ILoggerConfig = config.logger;
  public static database: IDatabaseConfig = config.database;
}
