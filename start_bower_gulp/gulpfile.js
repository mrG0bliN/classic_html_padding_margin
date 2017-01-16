'use strict';
// ==================================
// подключение гаупов из packagejson
var autoprefixer		= require('gulp-autoprefixer');
var browserSync		= require('browser-sync');
var clean				= require('gulp-clean');
var concat				= require('gulp-concat');
var data				= require('gulp-data');
var exec				= require('child_process').exec;
var gulp				= require('gulp');
var gulpLoadPlugins	= require('gulp-load-plugins');
var gutil				= require('gulp-util');
var notify				= require('gulp-notify');
var plugins				= gulpLoadPlugins();
var plumber			= require('gulp-plumber');
var reload				= browserSync.reload;
var stylus				= require('gulp-stylus');
var stylusTypeUtils	= require('stylus-type-utils');
var uglify				= require('gulp-uglify');
var rename 			= require('gulp-rename');
var concatCss 			= require('gulp-concat-css');
var cleanCSS 			= require('gulp-clean-css');
var sort 				= require('gulp-sort');
var order 				= require("gulp-order");

// ==================================
//пути для файлов
var path = {
    html: {
        source: 'src/**/*.html',
        destination: 'src/',
        watch: 'src/**/*.html'
    },
    css: {
        source: 'src/style/**/*.styl',
        destination: 'src/css/',
        watch: 'src/style/**/*'
    },
    js: {
        source: 'src/js/**/*.js',
        destination: 'src/js/',
        watch: 'src/js/**/*'
    }
};


// ==================================
// concat сборка JS  'src/libs/**/dist/**/*.min.js'
gulp.task('jslibs', function() {
return gulp.src([
 'src/libs/**/jquery/**/dist/**/*.min.js',
 'src/libs/**/tether/**/dist/**/*.min.js',
 'src/libs/**/bootstrap/**/dist/**/*.min.js',

  'src/libs/**/dist/**/*.min.js'])
 .on('error', notify.onError({
            message: "<%= error.message %>",
            title: "ERROR! -  "
        }))
        .pipe(concat('libs.js'))
         .pipe(uglify())
	.pipe(rename('libs.min.js'))
        .pipe(gulp.dest('src/js/'))
         .pipe(notify('LIBS - OK'));
});

// concat сборка CSS
gulp.task('csslibs', function() {
    return gulp.src([
 'src/libs/**/jquery/**/dist/**/*.min.css',
 'src/libs/**/tether/**/dist/**/*.min.css',
 'src/libs/**/bootstrap/**/dist/**/*.min.css',

  'src/libs/**/dist/**/*.min.css'])
        .pipe(sort())
        .pipe(concatCss('libs.css'))
         .pipe(cleanCSS({compatibility: 'ie8'}))
          .on('error', notify.onError({
            message: "<%= error.message %>",
            title: "ERROR! -  "
        }))
	.pipe(rename('libs.min.css'))
        .pipe(gulp.dest('src/css/'))
         .pipe(notify('CSS - OK'));
});



// ==================================
// сервер для тасков
gulp.task('lite-server', function(cb) {
    exec('npm run dev', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});


// очищаем перед сборкой
gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});


// Собираем html
gulp.task('html', function() {
    gulp.src(path.css.watch)
        .on('error', notify.onError({
            message: "<%= error.message %>",
            title: "ERROR! - <%= file.relative %>"
        }))
        .pipe(browserSync.stream())
        // .pipe(notify('HTML - OK'));
});

// Собираем Stylus
gulp.task('stylus', function() {
    return gulp.src(path.css.source)
    .pipe(stylus({ use: stylusTypeUtils() }))
        .on('error', notify.onError({
            message: "<%= error.message %>",
            title: "ERROR! - STYLUS"
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 version', '> 5%', 'safari 5', 'ie 8', 'ie 7', 'opera 12.1', 'ios 6', 'android 4'],
            cascade: false
        }))

    .pipe(gulp.dest(path.css.destination))
         .on('error', notify.onError({
            message: "<%= error.message %>",
            title: "ERROR! - <%= file.relative %>"
        }))
        .pipe(browserSync.stream())
        .pipe(notify('STYLUS - OK'));
});


// ==================================
// Watcher
gulp.task('watch', function() {
    function reportChange(event) {
        console.log('Event type: ' + event.type); // added, changed, or deleted
        console.log('Event path: ' + event.path); // The path of the modified file
    }

    gulp.watch(path.css.watch, ['stylus']).on('change', reportChange);
    gulp.watch(path.html.watch, ['html']).on('change', reload, reportChange);
});

//  запуск gulp
gulp.task('addlibs', ['csslibs', 'jslibs']);
gulp.task('default', ['addlibs', 'watch', 'lite-server']);
