const pathSrc = "./src";
const pathDest = "./public";

module.exports = {
  root: pathDest,
  html: {
    src: pathSrc + "/*.html",
    watch: pathSrc + "/**/*.html",
    dest: pathDest
  },

  pug: {
    src: pathSrc + "/*.pug",
    watch: pathSrc + "/**/*.pug",
    dest: pathDest
  },

  css: {
    src: pathSrc + "/css/*.css",
    watch: pathSrc + "/css/**/*.css",
    dest: pathDest + "/css"
  },
  js: {
    src: pathSrc + "/js/*.js",
    watch: pathSrc + "/js/**/*.js",
    dest: pathDest + "/js"
  },
  scss: {
    src: pathSrc + "/scss/*.{sass, scss}",
    watch: pathSrc + "/scss/**/*.{sass, scss}",
    dest: pathDest + "/css"
  },
  img: {
    src: pathSrc + "/img/**/*.*",
    watch: pathSrc + "/img/**/*.*",
    dest: pathDest + "/img"
  },
  fonts: {
    src: pathSrc + "/fonts/**/*.*",
    watch: pathSrc + "/fonts/**/*.*",
    dest: pathDest + "/fonts"
  }
}