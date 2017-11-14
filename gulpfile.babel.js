'use strict';

import gulp from 'gulp';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';

import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import minifycss from 'gulp-minify-css';
import imagemin from 'gulp-imagemin';

import htmlmin from 'gulp-htmlmin';
import notify from 'gulp-notify';
import rename from 'gulp-rename';
import browserSync from 'browser-sync';


// browserify
import browserify from 'browserify';
import sourcemaps from 'gulp-sourcemaps'; // source map就是一个信息文件，里面储存着位置信息，也就是说 转换后的代码的每一个位置，所对应的转换钱的位置，便于调试
import source from 'vinyl-source-stream'; // browserify的输出不能直接用做gulp的输入，vinly-source-stream主要是做一个转化
import buffer from 'vinyl-buffer'; // 用于将vinyl流转化为buffered vinyl文件（gulp-source及大部分gup插件都要这种格式）
import babelify from 'babelify';

var reload = browserSync.reload;

var srcDomain = 'spe/hqc_marathon/assets/';

gulp.task('html', () => {
    gulp.src('src/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(notify({ message: 'html task complete' }));
})

gulp.task('images', () => {
    gulp.src('src/images/*.*')
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('dist/style'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(notify({ message: 'images task complete' }));
})

gulp.task('sass', () => {
  return gulp.src(srcDomain + '*.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest(srcDomain))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest(srcDomain))
    .pipe(browserSync.reload({stream:true}))
    .pipe(notify({ message: 'sass task complete'}));
})

gulp.task('babel',() => {
  gulp.src(srcDomain + '*.js')
    .pipe(babel())
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest(srcDomain))
    .pipe(notify({ message: 'babel task complete' }));
})

gulp.task('js-watch', ['babel','browserify'], browserSync.reload);

// The static server
gulp.task('serve', ['sass'], () => {
    browserSync.init({
        server: {
            baseDir: srcDomain
        }
    });

    // gulp.watch("src/*.html").on('change', browserSync.reload);
    gulp.watch(srcDomain + '*.scss', ['sass']);
    // gulp.watch(srcDomain + "*.js", ['js-watch']);
});

// set browserify task
// gulp.task('browserify',()=> {
//     browserify({
//         entries: ['src/js/main.js','src/js/foo.js'], // 先处理依赖，入口文件
//         debug: true, // 告知browserify在运行同时声称内联的sourcemap 用于调试
//     })
//         .transform("babelify", {presets: ["es2015"]})// 进行转化
//         .bundle()// 多个文件打包成一个文件
//         .pipe(source('bundle.js')) // browserify的输出不能用做gulp的输入，所以需要source进行处理
//         .pipe(buffer()) // 缓存文件内容
//         .pipe(rename({ suffix: '.min' }))
//         .pipe(uglify())
//         // .pipe(sourcemaps.init({loadMaps: true })) // 从browserify 文件载入map
//         // .pipe(sourcemaps.write('.')) // 写入.map文件
//         .pipe(gulp.dest('dist/js'))
//         .pipe(notify({ message: 'browserify task complete' }));
// })


// gulp.task('default', ['html','images','sass','babel','serve','browserify']);
gulp.task('default', ['sass']);
gulp.task('watch', () => {
  gulp.watch(srcDomain + '*.scss',['sass']);
  // gulp.watch(srcDomain + '*.js', ['babel']);
  // gulp.watch('src/js/*.js', ['browserify']);
  // gulp.watch('src/*.html', ['html']);
  // gulp.watch('src/images/*.*', ['images'])
})
