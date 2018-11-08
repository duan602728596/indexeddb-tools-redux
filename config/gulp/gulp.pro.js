const path = require('path');
const gulp = require('gulp');
const babel = require('gulp-babel');
const babelConfig = require('./babelConfig');

let dirname = null;
let js = null;
let lib = null;

/* 编译es6 */
function babelProject(){
  console.log(lib);

  return gulp.src(js)
    .pipe(babel(babelConfig))
    .pipe(gulp.dest(lib));
}

gulp.task('babelProject', babelProject);

module.exports = function(dir){
  dirname = dir;
  js = path.join(dirname, 'src/**/*.js');
  lib = path.join(dirname, 'lib');

  gulp.task('default', ['babelProject']);
};