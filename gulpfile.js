var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var karma = require('karma').server;

gulp.task('minify', function () {
  'use strict';
  return gulp.src('./src/**/*.js')
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
