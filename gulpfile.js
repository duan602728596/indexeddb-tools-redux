const gulp = require('gulp');
const babel = require('gulp-babel');
const utf8convert = require('gulp-utf8-convert');
const bom = require('gulp-bom');
const uglify = require('gulp-uglify');

const dirname = __dirname;


function _ecma6(){
  return gulp.src(`${ dirname }/src/*.js`)
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(utf8convert())
    .pipe(bom())
    .pipe(uglify())
    .pipe(gulp.dest(`${ dirname }/build`));
}

gulp.task('default', gulp.series(
  gulp.parallel(_ecma6)
));