var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('minify', function () {
  'use strict';
  return gulp.src('./src/**/*.js')
    .pipe(uglify({
      compress: {
        global_defs: 'BlobReader'
      }
    }))
    .pipe(rename('./blob-reader.min.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['minify']);
