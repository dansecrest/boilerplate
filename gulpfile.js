'use strict';

// PLUGINS
var gulp = require('gulp');

var plugins = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});

var browserSync = require('browser-sync');
var del = require('del');


// ENVIRONMENTS
var development = plugins.environments.development;
var production = plugins.environments.production;


// STYLES
gulp.task('styles', function() {
    return gulp.src('src/scss/**/*.scss')
        .pipe(development(plugins.sourcemaps.init()))
        .pipe(plugins.sass({
            errLogToConsole: true
        }))
        .pipe(plugins.autoprefixer({
            browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
        }))
        .pipe(development(plugins.sourcemaps.write()))
        .pipe(production(plugins.minifyCss()))
        .pipe(production(plugins.rename({suffix: '.min'})))
        .pipe(gulp.dest('assets/css'));
});


// SCRIPTS
gulp.task('scripts', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(plugins.concat('all.js'))
        .pipe(production(plugins.uglify()))
        .pipe(production(plugins.rename({suffix: '.min'})))
        .pipe(gulp.dest('assets/js'));
});


// CLEAN
gulp.task('clean', function(cb) {
    del(['assets'], cb);
});


// BROWSERSYNC
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: './'
        },
        // proxy: 'site.dev',
        files: ['assets/css/**/*.css', 'src/js/**/*.js', '*.html']
    });
});


// WATCHES
gulp.task('watch', function() {
    gulp.watch('src/scss/**/*.scss', ['styles']);
    gulp.watch('src/js/**/*.js', ['scripts']);
});


// BUILD
gulp.task('build', ['clean'], function() {
    gulp.start(
        'styles',
        'scripts'
    );
});


// DEFAULT
gulp.task('default', ['clean'], function() {
    gulp.start(
        'styles',
        'scripts',
        'browser-sync',
        'watch'
    );
});
