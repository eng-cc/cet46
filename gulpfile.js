var gulp = require('gulp');

//引入组件
var $ = require('gulp-load-plugins')(); //引入所有gulp插件,暂时没有用

var jshint = require('gulp-jshint');
var less = require('gulp-less');
var concat = require('gulp-concat'); //连接文件
var uglify = require('gulp-uglify'); //压缩
var rename = require('gulp-rename');
var notify = require('gulp-notify'); //消息提示
var taskList = require('gulp-task-listing'); //列出所有task
var bytediff = require('gulp-bytediff'); //统计文件大小变化
var browser = require('browser-sync').create(); //自动刷新
var htmlmin = require('gulp-html-minify'); //html压缩
var cssmin = require('gulp-minify-css'); //css压缩

//压缩,重命名html
/*gulp.task('htmlmin', function() {
    gulp.src('./index*.html')
        .pipe($.bytediff.start())
        .pipe(rename('touse.html'))
        .pipe(htmlmin())
        .pipe($.bytediff.stop())
        .pipe(gulp.dest('./dist/html'))
        .pipe(notify({
            message: 'htmlmin task complete'
        }));
});*/
//压缩,重命名css
gulp.task('cssmin', function() {
    gulp.src('./css/*.css')
        .pipe($.bytediff.start())
        /*.pipe(rename('touse.min.css'))*/
        .pipe(cssmin())
        .pipe($.bytediff.stop())
        .pipe(gulp.dest('./dist/css'))
        .pipe(notify({
            message: 'cssmin task complete'
        }));
});
//检查脚本
gulp.task('lint', function() {
    gulp.src('./js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(notify({
            message: 'lint task complete'
        }));
});
//编译less,压缩css
gulp.task('less', function() {
    gulp.src('./less/*.less')
        .pipe(less())
        .pipe(gulp.dest('./css'))
        .pipe(notify({
            message: 'less task complete'
        }));
});
//合并，压缩js文件
gulp.task('scripts', function() {
    gulp.src('./js/*.js')
        //.pipe(concat('all.js'))
        .pipe(gulp.dest('./dist/js'))
        //.pipe(rename('all.min.js'))
        .pipe($.bytediff.start())
        .pipe(uglify())
        .pipe($.bytediff.stop())
        .pipe(gulp.dest('./dist/js'))
});
//自动刷新
gulp.task('browser', ['help'], function() {
    browser.init({
        files: ['./*.html', './**/*.{js,css}'],
        server: {
            baseDir: "./"
        }
    });
});
//列出task
gulp.task('help', taskList);
//默认任务
gulp.task('default', function() {
    gulp.run('scripts', 'browser', 'less', 'help');

    //监听文件变化
    gulp.watch('./js/*.js', ['lint', 'scripts']);
    gulp.watch('./less/*.less', ['less']);
    //gulp.watch('./index.html', ['htmlmin']);
    gulp.watch('./css/*.css', ['cssmin']);

});