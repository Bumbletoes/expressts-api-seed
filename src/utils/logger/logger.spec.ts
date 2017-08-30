import { expect } from 'chai';
import * as fs from 'fs';
import * as moment from 'moment';
import * as sinon from 'sinon';
import { Config } from '../../config';
import { Logger } from './logger';

/* tslint:disable:no-unused-expression */
describe('Logger', () => {
  before(() => {
    Logger.getInstance().setLogLevel('debug');
  });

  it('should throw an error message when created with new', () => {
    expect(() => { const logger = new Logger(); }).to
      .throw('The Logger is a singleton class and cannot be created!');
  });

  it('should create a log file in the log directory specified in the config', (done) => {
    const logDir: string = Config.logger.logDir;
    const logFile: string = Config.logger.logFile;
    const logFileTime: string = moment().utc().format('YYYY-MM-DD');
    expect(fs.existsSync(logDir)).to.be.true;
    expect(fs.existsSync(logFile)).to.be.false;
    Logger.getInstance().debug('Testing log file creation');
    // Have to delay a short period here to ensure log file has been created.
    /* tslint:disable:align */
    setTimeout(() => {
      expect(fs.existsSync(logFile + '.' + logFileTime)).to.be.true;
      done();
    }, 20);
  });
});
