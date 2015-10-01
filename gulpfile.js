'use strict';

// PLUGINS
var gulp = require('gulp');

var plugins = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});

var browserSync = require('browser-sync');
var del = require('del');


// STYLES
gulp.task('styles-dev', function() {
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

gulp.task('styles-build', function() {
    return gulp.src('src/scss/**/*.scss')
        .pipe(plugins.sass())
        .pipe(plugins.autoprefixer({
            browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
        }))
        .pipe(plugins.minifyCss())
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(gulp.dest('assets/css'));
});


// SCRIPTS
gulp.task('scripts-dev', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(plugins.concat('all.js'))
        .pipe(gulp.dest('assets/js'));
});

gulp.task('scripts-build', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(plugins.concat('all.js'))
        .pipe(plugins.uglify())
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(gulp.dest('assets/js'));
});


// CLEAN
gulp.task('clean', function(cb) {
    del(['assets/css', 'assets/js'], cb);
});


// BROWSERSYNC
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: './'
        },
        files: ['assets/css/**/*.css', 'src/js/**/*.js', '*.html']
    });
});


// WATCHES
gulp.task('watch', function() {
    gulp.watch('src/scss/**/*.scss', ['styles-dev']);
    gulp.watch('src/js/**/*.js', ['scripts-dev']);
});


// BUILD
gulp.task('build', ['clean'], function() {
    gulp.start(
        'styles-build',
        'scripts-build'
    );
});


// DEFAULT
gulp.task('default', ['clean'], function() {
    gulp.start(
        'styles-dev',
        'scripts-dev',
        'browser-sync',
        'watch'
    );
});
