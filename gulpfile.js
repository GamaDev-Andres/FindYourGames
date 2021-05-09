const { watch, src, dest, parallel, series } = require("gulp");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const concat = require("gulp-concat");
const imagemin = require("gulp-imagemin");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const webp = require("gulp-webp");
const cache = require("gulp-cache");

const cssnano = require("cssnano");

const patrones = {
  //notaaaaa NO PONERLE A LAS IMAGENES IMG--------> PORQUE TUVE UN ERROR CON GULP
  imagen: "src/imagenes/**/*",
  js: "src/javascript/**/*.js",
  scss: "src/scss/**/*.scss",
};
function css() {
  return src(patrones.scss)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("./build/css"));
}
function imagenes() {
  return src(patrones.imagen)
    .pipe(cache(imagemin({ optimizationLevel: 3 })))
    .pipe(dest("./build/img"));
}
function versionWebp() {
  return src(patrones.imagen).pipe(webp()).pipe(dest("./build/img"));
}
function watchArchivos() {
  watch(patrones.scss, css);
  watch(patrones.imagen, imagenes);
  watch(patrones.imagen, versionWebp);
}

exports.css = css;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.default = series(css, imagenes, versionWebp, watchArchivos);
