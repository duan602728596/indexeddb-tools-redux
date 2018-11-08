const path = require('path');
const gulp = require('gulp');
const changed = require('gulp-changed');
const plumber = require('gulp-plumber');
const babel = require('gulp-babel');
const errorHandler = require('./errorHandler.js');
const babelConfig = require('./babelConfig');

let dirname = null;
let js = null;
let lib = null;

/* 编译es6 */
function babelProject(){
  return gulp.src(js)
    .pipe(changed(lib, {
      extension: '.js'
    }))
    .pipe(plumber({
      errorHandler: errorHandler
    }))
    .pipe(babel(babelConfig))
    .pipe(gulp.dest(lib));
}

gulp.task('babelProject', babelProject);

function watch(){
  gulp.watch(js, ['babelProject']);
}

module.exports = function(dir){
  dirname = dir;
  js = path.join(dirname, 'src/**/*.js');
  lib = path.join(dirname, 'lib');

  gulp.task('default', ['babelProject'], function(){
    watch();
  });
};