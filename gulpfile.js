const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

const dirname = __dirname;


function _ecma(){
  return gulp.src(`${ dirname }/src/*.js`)
    .pipe(babel({
      presets: [
        [
          'env',
          {
            targets: {
              ie: 11,
              edge: 12,
              chrome: 40,
              firefox: 40
            },
            debug: false,
            modules: false,
            useBuiltIns: false,
            uglify: false
          }
        ]
      ],
    }))
    .pipe(uglify())
    .pipe(gulp.dest(`${ dirname }/build`));
}

gulp.task('default', gulp.series(
  gulp.parallel(_ecma)
));