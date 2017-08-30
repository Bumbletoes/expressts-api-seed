import * as del from 'del';
import * as gulp from 'gulp';
import * as mocha from 'gulp-mocha';
import * as nodemon from 'gulp-nodemon';
import * as shell from 'gulp-shell';
import * as typescript from 'gulp-tsc';
import gulpTslint from 'gulp-tslint';
import { config } from './gulpfile.config';

const setDevNodeEnvironment = (done) => {
  process.env.NODE_ENV = 'development';
  done();
};

// TODO: Clean these functions up -- put them somewhere else along with their dependencies
const clean = (done) => {
  return del([config.paths.bin], done);
};

const compileTypescript = () => {
  return gulp.src([config.paths.src])
    .pipe(typescript(require('./tsconfig.json').compilerOptions))
    .pipe(gulp.dest(config.paths.bin));
};

const copyConfig = () => {
  let configPath: string;
  configPath = `${config.paths.serverConfigFile}${process.env.NODE_ENV}.json`;
  return gulp.src(configPath)
    .pipe(gulp.dest(config.paths.serverConfigPath));
};

const lint = () => {
  return gulp.src(config.paths.src)
    .pipe(gulpTslint({
      formatter: 'verbose',
    }))
    .pipe(gulpTslint.report());
};

const test = () => {
  let reporter: string;
  return gulp.src([config.paths.test], { read: false })
    .pipe(mocha({
      require: 'ts-node/register',
      reporter: config[process.env.NODE_ENV].testReporter,
      reporterOptions: config[process.env.NODE_ENV].reporterOptions,
    }));
};

const watch = (done) => {
  return nodemon({
    script: config.paths.mainFile,
    ext: 'ts json',
    watch: [config.paths.src, config.paths.serverConfigFile + '**.json'],
    ignore: config.paths.ignore,
    env: { NODE_ENV: process.env.NODE_ENV },
    tasks: ['test'],
  });
};

gulp.task('help', shell.task('gulp --tasks'));
gulp.task('default', gulp.parallel('help'));
gulp.task('clean', clean);
gulp.task('lint', lint);
gulp.task('build:dev', gulp.series(setDevNodeEnvironment, clean, compileTypescript, copyConfig));
gulp.task('build', gulp.series(clean, compileTypescript, copyConfig));
gulp.task('test', gulp.series('build:dev', test));
gulp.task('watch', watch);
gulp.task('develop', gulp.series('build:dev', 'test', 'watch'));
