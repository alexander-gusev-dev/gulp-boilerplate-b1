var gulp = require('gulp'),
	sass = require('gulp-sass')(require('sass')),
	sourcemaps = require('gulp-sourcemaps'),
	fileinclude = require('gulp-file-include'),
	browsersync = require('browser-sync').create(),
	wait = require('gulp-wait'),
	del = require('del');

function clean(done) {
	del.sync('build');
	done();
};

function styles(done) {
	return gulp.src('src/sass/**/*.scss')
		.pipe(wait(200))
		.pipe(sourcemaps.init())
		.pipe(sass({indentType: 'space', indentWidth: '4', outputStyle: 'expanded'}).on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('build/css'))
		.pipe(browsersync.reload({stream:true}));
	done();
}

function html(done) {
	return gulp.src('src/**/*.html')
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@root'
		}))
		.pipe(gulp.dest('build/'))
		.pipe(browsersync.reload({stream:true}));
	done();
};

function favicon(done) {
	gulp.src('src/*.ico')
		.pipe(gulp.dest('build/'));
	done();
};

function assets(done) {
	gulp.src('src/assets/**/*')
		.pipe(gulp.dest('build/assets'));
	done();
};

function watchFiles() {
    gulp.watch("./src/assets", gulp.series(assets));
    gulp.watch("./src/sass/**/*.scss", gulp.series(styles));
    gulp.watch("./src/**/*.html", gulp.series(html));
}

function browserSync(done) {
    browsersync.init({
      server: {
        baseDir: "./build/"
      },
      port: 3000
    });
    done();
}

const watch = gulp.parallel(watchFiles, browserSync);
const build = gulp.series(clean, favicon, html, assets, styles, watch);

exports.build = build;
exports.watch = watch;
exports.default = build;