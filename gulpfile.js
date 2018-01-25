var gulp = require('gulp'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    postcss = require("gulp-postcss"),
    autoprefixer = require('autoprefixer'),
    flexbugs = require('postcss-flexbugs-fixes'),
    livereload = require('gulp-livereload');

gulp.task('watch', function() {
  livereload.listen();
  watch('src/styles/**/*.scss', (event) => gulp.start('sass'));
});

// Compiles SASS > CSS
gulp.task('sass', function() {
  return gulp.src(['src/styles/main.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([ autoprefixer, flexbugs ]))
    .pipe(gulp.dest('dist'))
    .pipe(livereload());
});