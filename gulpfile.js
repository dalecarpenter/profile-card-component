// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series } = require('gulp');
// Importing all the Gulp-related packages we want to use
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browsersync = require('browser-sync').create();

// Sass task: compiles the style.scss file into style.css
function scssTask() {
  return src('src/scss/styles.scss', { sourcemaps: true })
    .pipe(sass()) // compile SCSS to CSS
    .pipe(postcss([autoprefixer(), cssnano()])) // PostCSS plugins
    .pipe(dest('public/css', { sourcemaps: '.' })); // put final CSS in dist folder
}

function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: 'public',
    },
  });
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch task: watch SCSS and JS files for changes
// If any change, run scss and js tasks simultaneously
function watchTask() {
  watch('public/**/*.html', browsersyncReload);
  watch('src/**/*.scss', series(scssTask, browsersyncReload));
}

// Export the default Gulp task so it can be run
// Runs the scss and js tasks simultaneously
// then runs cacheBust, then watch task
exports.default = series(scssTask, browsersyncServe, watchTask);
