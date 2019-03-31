const gulp = require('gulp');
const typescript = require('gulp-typescript');
const tsconfig = require('./tsconfig.json');

/* lib */
function proLibProject() {
  const result = gulp.src('src/**/*.ts')
    .pipe(typescript(tsconfig.compilerOptions));

  return result.js.pipe(gulp.dest('lib'));
}

exports.default = proLibProject;