const gulp = require('gulp');
const babel = require('gulp-babel');

let dirname = null;

function babelProject(){
  return gulp.src(dirname + '/src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest(dirname + '/lib'));
}

module.exports = function(dir){
  dirname = dir;
  gulp.task('default', babelProject);
};