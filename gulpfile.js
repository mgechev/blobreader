var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var karma = require('karma').server;
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('build', function () {
  'use strict';
  return browserify(['./src/index.js'])
    .bundle()
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(rename('index.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('minify', ['build'], function () {
  'use strict';
  return gulp.src('./dist/index.js')
    .pipe(uglify())
    .pipe(rename('./blob-reader.min.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('test', function () {
  'use strict';
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  });
});

gulp.task('autoTest', function () {
  'use strict';
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
  });
});

gulp.task('default', ['minify', 'test']);

