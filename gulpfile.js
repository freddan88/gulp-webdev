const gulp = require("gulp");
const sass = require("gulp-sass");
const babel = require("gulp-babel");
const autoPrefixer = require("gulp-autoprefixer");
const fileInclude = require("gulp-file-include");
const browserSync = require("browser-sync").create();
const uglify = require("gulp-uglify");
const uglifycss = require("gulp-uglifycss");
const htmlmin = require("gulp-htmlmin");

const autoPrefixOptions = {
  grid: "autoplace",
  cascade: false,
  remove: false,
};

const babeljs = () => {
  return gulp
    .src("./src/scripts/*.js")
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest("./build"));
};

const styles = () => {
  return gulp
    .src(["./src/styles/style.scss"])
    .pipe(sass().on("error", sass.logError))
    .pipe(autoPrefixer(autoPrefixOptions))
    .pipe(
      uglifycss({
        maxLineLen: 80,
        uglyComments: true,
      })
    )
    .pipe(gulp.dest("./build"))
    .pipe(browserSync.stream());
};

const files = () => {
  return gulp
    .src(["./src/index.html"])
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "./src/components",
      })
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("./build"));
};

const watch = () => {
  browserSync.init({
    server: {
      baseDir: "./build",
    },
  });
  gulp.watch("./src/**/*.js", babeljs);
  gulp.watch("./src/**/*.html", files);
  gulp.watch("./src/styles/**/*.scss", styles);
  gulp.watch("./src/**/*.html").on("change", browserSync.reload);
  gulp.watch("./src/scripts/*.js").on("change", browserSync.reload);
};

exports.babeljs = babeljs;
exports.styles = styles;
exports.watch = watch;
exports.files = files;
