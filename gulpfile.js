const gulp = require('gulp');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create('My server');
const fs = require('fs');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const ejs = require('gulp-ejs');
const isProd = process.env.NODE_ENV === 'production' ? true : false;
const srcDir = './src/';
const distDir = './assets/';
const targetBrowsers = ['last 1 versions'];

gulp.task('sass', () => {
  return gulp.src(`${srcDir}scss/**/*.scss`)
    .pipe(plumber({
      errorHandler: notify.onError("<%= error.message %>")
    }))
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(autoprefixer({
      browsers: targetBrowsers
    }))
    .pipe(cleanCSS())
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest(`${distDir}css`))
    .pipe(browserSync.stream());
});

gulp.task('js', () => {
  gulp.src(`${srcDir}js/**/*.js`)
    .pipe(plumber())
    .pipe(babel({
      'presets': [
    		['env', {
    			'targets': {
    				'browsers': targetBrowsers
    			}
    		}]
    	]
    }))
    .pipe(gulp.dest(`${distDir}js`))
    .pipe(browserSync.stream());
});

gulp.task('bundle', () => {
  webpackStream(webpackConfig, webpack)
    .pipe(plumber())
    .pipe(gulp.dest(`${distDir}js`))
    .pipe(browserSync.stream());
});

gulp.task('ejs', () => {
  const pageData = JSON.parse(fs.readFileSync(`${srcDir}ejs/pages.json`));
  pageData.forEach(function(data, i) {
    gulp.src(data.template)
      .pipe(plumber())
      .pipe(ejs({pageData: data}))
      .pipe(rename(data.outputPath))
      .pipe(gulp.dest('./'))
      .pipe(browserSync.stream());
  })
});

gulp.task('server', () => {
  browserSync.init({
    server: {
      baseDir: './'
    },
    notify: false
  })
});

gulp.task('build', ['ejs','sass','bundle']);

gulp.task('watch', () => {
  gulp.watch(`${srcDir}ejs/**/*.ejs`, ['ejs']);
  gulp.watch(`${srcDir}scss/**/*.scss`, ['sass']);
  gulp.watch(`${srcDir}js/**/*.js`, ['bundle']);
});

gulp.task('default', ['build','server','watch']);
