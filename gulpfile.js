'use strict';

// Include gulp
var gulp = require('gulp');

// Include plugins
var plugins = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});

var browserSync = require('browser-sync');
var del = require('del');

// Styles for dev
gulp.task('styles-dev', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass({
            errLogToConsole: true
        }))
        .pipe(plugins.autoprefixer({
            browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
        }))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest('assets/css'));
});

// Scripts for dev
gulp.task('scripts-dev', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(plugins.concat('all.js'))
        .pipe(gulp.dest('assets/js'));
});

// Styles for build
gulp.task('styles-build', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(plugins.sass())
        .pipe(plugins.autoprefixer({
            browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
        }))
        .pipe(plugins.minifyCss())
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(gulp.dest('assets/css'));
});

// Scripts for build
gulp.task('scripts-build', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(plugins.concat('all.js'))
        .pipe(plugins.uglify())
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(gulp.dest('assets/js'));
});

// Remove assets to start fresh
gulp.task('clean', function (cb) {
    del(['assets/css', 'assets/js'], cb);
});

// Browser sync task to start serve
gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: './'
        },
        files: ['assets/css/**/*.css', 'src/js/**/*.js', '*.html']
    });
});

// Watch files for changes
gulp.task('watch', function () {
    gulp.watch('src/scss/**/*.scss', ['styles-dev']);
    gulp.watch('src/js/**/*.js', ['scripts-dev']);
});

// Build task
gulp.task('build', ['clean'], function () {
    gulp.start(
        'styles-build',
        'scripts-build'
    );
});

// Default task
gulp.task('default', ['clean'], function () {
    gulp.start(
        'styles-dev',
        'scripts-dev',
        'browser-sync',
        'watch'
    );
});
