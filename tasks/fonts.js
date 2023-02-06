const {src, dest} = require('gulp');

// Конфигурация
const path = require("../config/path.js");
const app = require("../config/app.js");
//ПЛагины
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const fileInclude = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const size = require('gulp-size');


const fonts = ()  => {
  return src(path.fonts.src)
    .pipe(dest(path.fonts.dest))
}


module.exports = fonts;