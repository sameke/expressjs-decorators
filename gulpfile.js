const gulp = require('gulp');
const bump = require('gulp-bump');

gulp.task('bump', () => {
    return gulp.src('./package.json')
        .pipe(bump({ type: 'patch' }))
        .pipe(gulp.dest('./'));
});