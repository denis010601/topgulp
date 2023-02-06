const {src, dest} = require('gulp');

// Конфигурация
const path = require("../config/path.js");
const app = require("../config/app.js");

//ПЛагины
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const size = require('gulp-size');
const shorthand= require('gulp-shorthand');
const groupCssMediaQueries= require('gulp-group-css-media-queries');
const sass= require('gulp-sass')(require("sass"));
const sassGlob= require('gulp-sass-glob');

// обработка scss
const scss = ()  => {
  return src(path.scss.src, {sourcemaps: true})
    .pipe(plumber({
      errorHandler: notify.onError(error => ({
        title: "scss",
        message: error.message
      }))
    }))
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(shorthand())
    .pipe(groupCssMediaQueries())
    .pipe(size({title: "Размер main.css"}))
    .pipe(dest(path.scss.dest, {sourcemaps: true}))
    .pipe(rename({suffix: '.min'}))
    .pipe(csso())
    .pipe(size({title: "Размер main.min.css"}))
    .pipe(dest(path.scss.dest, {sourcemaps: true}))
}

module.exports = scss;