'use strict';

// PLUGINS
var gulp = require('gulp');

var plugins = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});

var async = require('async');
var browserSync = require('browser-sync');
var del = require('del');
var runSequence = require('run-sequence');

var runTimestamp = Math.round(Date.now()/1000);


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


// ICONS
gulp.task('iconfont', function(done) {
    var iconStream = gulp.src(paths.assets.icons)
        .pipe(plugins.iconfont({
            fontHeight: 1001,
            fontName: 'icons',
            formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
            normalize: true,
            prependUnicode: false,
            timeStamp: runTimestamp
        }));

    async.parallel([
        function handleGlyphs(callback) {
            iconStream.on('glyphs', function(glyphs, options) {
                gulp.src('src/styles/icons.css')
                    .pipe(plugins.consolidate('lodash', {
                        className: 'icon',
                        fontName: 'icons',
                        fontPath: '../fonts/',
                        glyphs: glyphs
                    }))
                    .pipe(gulp.dest('assets/styles'))
                    .on('finish', callback);
            });
        },
        function handleFonts(callback) {
            iconStream
                .pipe(gulp.dest('assets/fonts'))
                .on('finish', callback);
        }
    ], done);
});


// STYLES
gulp.task('styles', function(callback) {
    return gulp.src('src/styles/**/*.scss')
        .pipe(development(plugins.sourcemaps.init()))
        .pipe(plugins.sass({
            errLogToConsole: true
        }).on('error', function(error) {
            console.error('Error!', error.message);
            callback();
        }))
        .pipe(plugins.autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(development(plugins.sourcemaps.write()))
        .pipe(production(plugins.cleanCss()))
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
gulp.task('build', ['clean'], function(callback) {
    runSequence(
        'imagemin',
        'iconfont',
        ['styles', 'scripts'],
        callback
    );
});


// DEFAULT
gulp.task('default', ['clean'], function(callback) {
    runSequence(
        'imagemin',
        'iconfont',
        ['styles', 'scripts'],
        'browser-sync',
        'watch',
        callback
    );
});
