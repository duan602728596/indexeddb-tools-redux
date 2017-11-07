const gulp = require('gulp');
const babel = require('gulp-babel');
const babelConfig = require('./babel.config');

let dirname = null;

function babelProject(){
  return gulp.src(dirname + '/src/**/*.js')
    .pipe(babel(babelConfig))
    .pipe(gulp.dest(dirname + '/lib'));
}

module.exports = function(dir){
  dirname = dir;
  gulp.task('default', babelProject);
};