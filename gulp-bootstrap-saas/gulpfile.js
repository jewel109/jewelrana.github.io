const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const terser = require("gulp-terser"); // js minfier
const browsersync = require("browser-sync").create();
const purgecss = require('gulp-purgecss');

//SASS TASK
function scssTask() {
	return src("app/scss/style.scss", { sourcemaps: true })
		.pipe(sass())
		.pipe(postcss([ require('autoprefixer'), ]))
		// .pipe(purgecss({content:['.html']}))
		.pipe(dest("dist/css", { sourcemaps: "." }));
}
// CSS TASK
// function cssTask() {
// 	return src('dist/css/style.css')
// 			.pipe(postcss([require('autoprefixer')]))
// 			.pipe(dest('build/css'))
// }
// JS TASK
function jsTask() {
	return src("app/js/script.js", { sourcemaps: true })
		.pipe(terser())
		.pipe(dest("dist/js", { sourcemaps: "." }));
}

// Browsersync Tasks
function browsersyncServe(cb) {
	browsersync.init({
		server: {
			baseDir: ".",
		},
	});
	cb();
}

function browsersyncReload(cb) {
	browsersync.reload();
	cb();
}

// Watch Task
function watchTask() {
	watch("*.html", browsersyncReload);
	watch(
		["app/scss/**/*.scss", "app/js/**/*.js",],
		series(scssTask, jsTask, browsersyncReload)
	);
}

exports.default = series(scssTask, jsTask, browsersyncServe, watchTask);
