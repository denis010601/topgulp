const {src, dest} = require('gulp');

// Конфигурация
const path = require("../config/path.js");
const app = require("../config/app.js");

//ПЛагины
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const size = require('gulp-size');
const uglify = require('gulp-uglify');



// обработка js
const js = ()  => {
  return src(path.js.src, {sourcemaps: true})
    .pipe(plumber({
      errorHandler: notify.onError(error => ({
        title: "js",
        message: error.message
      }))
    }))
    .pipe(size({title: "Размер main.js"}))
    .pipe(dest(path.js.dest, {sourcemaps: true}))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(size({title: "Размер main.min.js"}))
    .pipe(dest(path.js.dest, {sourcemaps: true}))
}

module.exports = js;