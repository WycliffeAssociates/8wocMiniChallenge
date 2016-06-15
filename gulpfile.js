var gulp = require('gulp'),
	browserify = require('browserify'),
	source = require('vinyl-source-stream');


gulp.task('default', ['watch']);


gulp.task('watch', ['browserify'], function() {
	gulp.watch(['scripts/index.js', 'scripts/modules/*.js'], ['browserify']);
});


gulp.task('browserify', function() {
	return browserify('./scripts/index.js')
		.bundle()
		.pipe(source('bundled.js'))
		.pipe(gulp.dest('scripts'));
});
