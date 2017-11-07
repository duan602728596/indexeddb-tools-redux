const gulp = require('gulp');
const changed = require('gulp-changed');
const plumber = require('gulp-plumber');
const babel = require('gulp-babel');
const errorHandler = require('./errorHandler.js');
const babelConfig = require('./babel.config');

let dirname = null;

function babelProject(){
  return gulp.src(dirname + '/src/**/*.js')
    .pipe(changed(dirname + '/lib', {
      extension: '.js'
    }))
    .pipe(plumber({
      errorHandler: errorHandler
    }))
    .pipe(babel(babelConfig))
    .pipe(gulp.dest(dirname + '/lib'));
}

function watch(){
  gulp.watch(dirname + '/src/**/*.js', gulp.series(babelProject));
}

module.exports = function(dir){
  dirname = dir;
  gulp.task('default', gulp.series(babelProject, watch));
};