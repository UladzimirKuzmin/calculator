/* global require */

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    htmlmin = require('gulp-htmlmin'),
    inlineCss = require('gulp-inline-css'),
    uglify = require('gulp-uglify'),
    csso = require('gulp-csso'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    del = require('del'),
    merge = require('merge-stream'),
    connect = require('gulp-connect'),
    path = require('path');

var dirs = {
  src: './src',
  build: './build',
  bower: './bower_components'
};

var paths = {
  scripts: {
    app: [dirs.src + '/app/app.js'],
    config: [dirs.src + '/app/config.js'],
    vendors: {
      requirejs: [dirs.bower + '/requirejs/require.js'],
      lodash: [dirs.bower + '/lodash/dist/lodash.js']
    }
  },
  html: [
    dirs.src + '/index.html'
  ],
  scss: [
    dirs.src + '/assets/scss/styles.scss'
  ],
  images: [
    dirs.src + '/assets/images/**'
  ],
  fonts: [dirs.src + '/assets/fonts/**'],
  cleanup: [
    '!' + dirs.build + '/.gitignore',
    dirs.build + '/**/*.*'
  ]
};

/* Common tasks */
gulp.task('lint', function() {
  return gulp.src(dirs.src + '/app/*.js')
    .pipe(jshint('./.jshintrc'))
    .pipe(jshint.reporter(stylish));
});

gulp.task('cleanup', function() {
  return del(paths.cleanup, {
    force: true
  });
});

gulp.task('templates', [], function() {
  return gulp.src(paths.html)
    //.pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(dirs.build));
});

gulp.task('copy', [], function() {
  var images = gulp.src(paths.images)
    .pipe(gulp.dest(dirs.build + '/assets/images'))
    .on('error', function(error) {
      console.log('copy - images:', error);
    });

  var fonts = gulp.src(paths.fonts)
    .pipe(gulp.dest(dirs.build + '/assets/fonts'))
    .on('error', function(error) {
      console.log('copy - fonts:', error);
    });

  return merge(images, fonts);
});

/* Dev tasks */
gulp.task('scss-dev', [], function() {
  return gulp.src(paths.scss)
    .pipe(sass())
    .pipe(concat('styles.css'))
    .pipe(gulp.dest(dirs.build + '/assets/css'));
});

gulp.task('js-dev-app', [], function() {
  var app = gulp.src(paths.scripts.app)
    .pipe(concat('app.js'))
    .pipe(gulp.dest(dirs.build + '/js'));  
});

gulp.task('js-dev', [], function() {
  //requirejs    
  gulp.src(paths.scripts.vendors.requirejs)
    .pipe(concat('require.js'))
    .pipe(gulp.dest(dirs.build + '/js'));

  //config  
  gulp.src(paths.scripts.config)
    .pipe(concat('config.js'))
    .pipe(gulp.dest(dirs.build + '/js'));  

  //lodash
  gulp.src(paths.scripts.vendors.lodash)
    .pipe(concat('lodash.js'))
    .pipe(gulp.dest(dirs.build + '/js'));  
});

gulp.task('server', function() {
  connect.server({
    port: 8888,
    root: dirs.build,
    livereload: false
  });
});

/* Main tasks */
gulp.task('watch', function() {
  gulp.watch(paths.scripts.app, ['lint', 'js-dev-app']);
  gulp.watch([paths.scss, dirs.src + '/assets/scss/shared/*.scss'], ['scss-dev']);
  gulp.watch(paths.html, ['templates']);
  gulp.watch(paths.images, ['copy']);
});

gulp.task('build-dev', ['lint', 'copy', 'js-dev', 'js-dev-app', 'templates', 'scss-dev'], function() {

});

gulp.task('default', ['build-dev', 'watch', 'server'], function() {
  
});
