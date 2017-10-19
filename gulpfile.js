'use strict';

// Plugins
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var del = require('del');
var rename = require('gulp-rename');
var rev = require('gulp-rev');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

// Clean public directories
gulp.task('clean', function () {
    return del([
        'public/css/**/*',
        'public/fonts/**/*',
        'public/js/**/*'
    ]);
});

// Fonts
gulp.task('fonts', function() {
    return gulp.src('node_modules/font-awesome/fonts/*')
        .pipe(gulp.dest('public/fonts/'));
});

// Compile CSS
gulp.task('compile-scss', ['clean'], function () {
    return gulp.src('resources/sass/**/*.scss')
        .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['> 1%', 'Last 5 versions', 'Firefox > 20', 'IE 8'],
            cascade: false
        }))
        .pipe(gulp.dest('public/css/'));
});

// Minify CSS
gulp.task('minify-css', ['compile-scss'], function () {
    return gulp.src('public/css/*.css')
        .pipe(sourcemaps.init())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/css/'));
});

// Concat javascripts plugins
gulp.task('concat-plugins-js', ['clean'], function () {
    return gulp.src([
        'node_modules/jquery/dist/jquery.js'
    ]).pipe(concat('plugins.js'))
        .pipe(gulp.dest('public/js/'));
});

// Concat javascripts scripts
gulp.task('concat-scripts-js', ['clean'], function () {
    return gulp.src('resources/js/**/*.js')
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('public/js/'));
});

// Minify JS
gulp.task('minify-js', ['concat-plugins-js', 'concat-scripts-js'], function () {
    return gulp.src('public/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/js/'));
});

// Revision
gulp.task('revision', ['minify-css', 'minify-js'], function() {
    return gulp.src([
        'public/css/*.min.css',
        'public/js/*.min.js'
    ], {base: 'public'})
        .pipe(sourcemaps.init())
        .pipe(rev())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public'))
        .pipe(rev.manifest('manifest.json', {merge: true}))
        .pipe(gulp.dest('public'));
});

// Default task
gulp.task('default', [
    'clean',
    'compile-scss',
    'concat-plugins-js',
    'concat-scripts-js',
    'fonts',
    'minify-css',
    'minify-js',
    'revision'
]);
