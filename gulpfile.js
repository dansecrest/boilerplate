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


// PATHS
var paths = {
    assets: {
        fonts: 'src/fonts/*.*',
        icons: 'src/fonts/icons/**/*.*',
        images: 'src/images/**/*.*'
    },
    scripts: {
        vendor: [],
        main: []
    }
};


// STYLES
gulp.task('styles', function() {
    return gulp.src('src/styles/**/*.scss')
        .pipe(development(plugins.sourcemaps.init()))
        .pipe(plugins.sass({
            errLogToConsole: true
        }))
        .pipe(plugins.autoprefixer({
            browsers: ['last 2 version']
        }))
        .pipe(development(plugins.sourcemaps.write()))
        .pipe(production(plugins.minifyCss()))
        .pipe(production(plugins.rename({suffix: '.min'})))
        .pipe(gulp.dest('assets/styles'));
});


// SCRIPTS
gulp.task('scripts', function() {
    return gulp.src('src/scripts/**/*.js')
        .pipe(plugins.concat('main.js'))
        .pipe(production(plugins.uglify()))
        .pipe(production(plugins.rename({suffix: '.min'})))
        .pipe(gulp.dest('assets/scripts'));
});


// IMAGEMIN
gulp.task('imagemin', function() {
    return gulp.src(paths.assets.images)
        .pipe(plugins.imagemin())
        .pipe(gulp.dest('assets/images'));
});


// CLEAN
gulp.task('clean', function() {
    return del(['assets'], {
        force: true
    });
});


// BROWSERSYNC
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: './'
        },
        // proxy: 'site.dev',
        files: ['assets/styles/**/*.css', 'src/scripts/**/*.js', '*.html']
    });
});


// WATCHES
gulp.task('watch', function() {
    gulp.watch('src/styles/**/*.scss', ['styles']);
    gulp.watch('src/scripts/**/*.js', ['scripts']);
});


// BUILD
gulp.task('build', ['clean'], function() {
    gulp.start(
        'imagemin',
        'styles',
        'scripts'
    );
});


// DEFAULT
gulp.task('default', ['clean'], function() {
    gulp.start(
        'imagemin',
        'styles',
        'scripts',
        'browser-sync',
        'watch'
    );
});
