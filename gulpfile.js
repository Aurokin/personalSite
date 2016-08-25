var gulp = require('gulp');

var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var server = require('gulp-express');

gulp.task('lint', function() {
  return gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('sass', function() {
  return gulp.src('src/sass/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/css'))
    .pipe(server.notify());
});

gulp.task('scripts', function() {
  return gulp.src('src/js/*.js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist'))
    .pipe(rename('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(server.notify());
});

gulp.task('html', function() {
  return gulp.src('src/html/*.html')
    .pipe(gulp.dest('dist/html'))
    .pipe(server.notify());
});

gulp.task('watch', function() {
  gulp.watch('src/html/*.html', ['html']);
  gulp.watch('src/js/*.js', ['lint', 'scripts']);
  gulp.watch('src/sass/*.scss', ['sass']);
  gulp.watch(['app.js'], ['server']);
});

gulp.task('server', function() {
  server.run(['app.js']);
});

gulp.task('default', ['lint', 'sass', 'scripts', 'html', 'watch', 'server']);
