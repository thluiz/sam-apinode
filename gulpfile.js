// Include gulp
var gulp = require('gulp');
var exec = require('child_process').exec;
const rename = require('gulp-rename');
gulp.task('build', function (cb) {
    exec('cd apex && ng build -prod', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        var ncp = require('ncp').ncp;
        ncp('apex/dist', "public", function (err) {
            if (err) {
                return console.error(err);
            }
            console.log('done!');
        });
        cb(err);
    });
});
gulp.task('commit', (cb) => {
    var argv = require('yargs').argv;
    var commit = argv.c;
    exec(`git add . -A && git commit -m '${commit}'`, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});
gulp.task('push', ['commit'], (cb) => {
    exec(`git push -u origin master`, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});
gulp.task('publish', ['push'], function (cb) {
});
// Default Task
gulp.task('default', ['publish']);
//# sourceMappingURL=gulpfile.js.map