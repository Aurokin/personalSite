var gulp = require('gulp');

var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var filter = require('gulp-filter');
var flatten = require('gulp-flatten');
var minifyCSS = require('gulp-minify-css');
var server = require('gulp-express');
var mainBowerFiles = require('main-bower-files')

gulp.task('lint', function() {
  return gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('sass', function() {
  return gulp.src('src/sass/*.scss')
    .pipe(sass({
      includePaths: ['bower_components/foundation-sites/scss']
    }))
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(gulp.dest('dist/css'))
    .pipe(server.notify());
});

gulp.task('scripts', function() {
  return gulp.src('src/js/*.js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist/js'))
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

gulp.task('bower', function() {
  var jsFilter = filter('**/*.js', {restore: true});
  var cssFilter = filter('**/*.css', {restore: true});
  var sassFilter = filter('**/*.scss', {restore: true});
  var fontFilter = filter(['**/*.eot', '**/*.woff', '**/*.svg', '**/*.ttf'], {restore: true});
  var imageFilter = filter(['**/*.gif', '**/*.png', '**/*.svg', '**/*.jpg', '**/*.jpeg'], {restore: true});

  console.log(mainBowerFiles())

  return gulp.src(mainBowerFiles())
    // JS
    .pipe(jsFilter)
    .pipe(concat('lib.js'))
    .pipe(gulp.dest('dist/js/lib'))
    .pipe(uglify())
    .pipe(rename('lib.min.js'))
    .pipe(gulp.dest('dist/js/lib'))
    .pipe(jsFilter.restore)
    // CSS
    .pipe(cssFilter)
    .pipe(concat('lib.css'))
    .pipe(gulp.dest('dist/css/lib'))
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(rename('lib.min.css'))
    .pipe(gulp.dest('dist/css/lib'))
    .pipe(cssFilter.restore)
    // FONTS
    .pipe(fontFilter)
    .pipe(flatten())
    .pipe(gulp.dest('/dist/fonts/lib'))
    .pipe(fontFilter.restore)
    // IMAGES
    .pipe(imageFilter)
    .pipe(flatten())
    .pipe(gulp.dest('/dist/images/lib'))
    .pipe(imageFilter.restore)
    .pipe(server.notify());
});

gulp.task('server', function() {
  server.run(['app.js']);
});

gulp.task('watch', function() {
  gulp.watch('src/html/*.html', ['html']);
  gulp.watch('src/js/*.js', ['lint', 'scripts']);
  gulp.watch('src/sass/*.scss', ['sass']);
  gulp.watch('bower_components/**', ['bower']);
  gulp.watch(['app.js'], ['server']);
});

gulp.task('default', ['lint', 'sass', 'scripts', 'html', 'bower', 'watch', 'server']);
