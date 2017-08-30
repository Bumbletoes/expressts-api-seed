'use strict';
import * as path from 'path';

export const config = {
  test: {
    testReporter: 'mocha-jenkins-reporter',
    reporterOptions: {
      junit_report_name: 'Radar-Core-API-Test-Suite',
      junit_report_path: './test-reports/test-results.xml',
      junit_report_stack: 1,
    },
  },
  development: {
    testReporter: 'spec',
    reporterOptions: {
      test: '',
    },
  },
  paths: {
    bin: path.join(__dirname, './bin/'),
    src: path.join(__dirname, './src/**/*.ts'),
    test: path.join(__dirname, './src/**/*.spec.ts'),
    serverConfigPath: path.join(__dirname, './bin/config/'),
    serverConfigFile: path.join(__dirname, './src/config/config.'),
    mainFile: path.join(__dirname, './bin/main.js'),
    ignore: ['./src/**/.gulp**.ts'],
  },
};
