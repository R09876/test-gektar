const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
//const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
//const groupCssMediaQueries = require('gulp-group-css-media-queries');
const csso = require('gulp-csso');
const webp = require('gulp-webp');
const rename = require('gulp-rename');
const clean = require('gulp-clean');

// Компиляция Sass в CSS, минификация и сохранение в dist/css
function compileSass() {
  return gulp
    .src('src/sass/styles.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    //.pipe(autoprefixer())
    //.pipe(groupCssMediaQueries())
    .pipe(csso())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
}

// Копирование
function copy() {
  return gulp
    .src(['src/fonts/*','src/*.html', 'src/js/*.js','src/img/**/*'], {
      base: 'src',
    })
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
};

// Конвертация изображений в WebP
function convertToWebp() {
  return gulp
    .src('src/img/**/*.{jpg,jpeg,png}')
    .pipe(webp())
    .pipe(gulp.dest('dist/img'))
    .pipe(browserSync.stream());
}

// Очистка папки dist
function cleanDist() {
  return gulp.src('dist', { read: false, allowEmpty: true }).pipe(clean());
}

// Запуск сервера BrowserSync
function startServer() {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  });

  gulp.watch('src/*.html', copy);
  gulp.watch('src/sass/**/*.scss', compileSass);
  gulp.watch('src/img/**/*.{jpg,jpeg,png}', convertToWebp);
}

// Задача для запуска сборки
const build = gulp.series(cleanDist,gulp.parallel(compileSass, copy, convertToWebp));

// Задача запуск сборки и сервера
const start = gulp.series(build, startServer);


exports.build = build;
exports.start = start;