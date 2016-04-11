var gulp          = require('gulp');
		less          = require('gulp-less'),
		path          = require('path'),
		minifyCss     = require('gulp-minify-css'),
		browserSync   = require('browser-sync'),
		gutil         = require('gulp-util'),
		autoprefixer  = require('gulp-autoprefixer'),
		svgsprites    = require('gulp-svg-sprite'),
    sourcemaps    = require('gulp-sourcemaps'),
    imagemin      = require('gulp-tinypng'),
    imageResize   = require('gulp-image-resize'),
    concat        = require('gulp-concat'),
    uglify        = require('gulp-uglify'),
    notify        = require('gulp-notify'),
    sftp          = require('gulp-sftp'),
    ftp           = require('gulp-ftp'),
    spritesmith   = require('gulp.spritesmith'),
    eslint        = require('gulp-eslint');

/*==============================
=           Watcher            =
==============================*/
gulp.task('watch', ['less'], function() {
  browserSync.init({ 
    proxy: "localhost:8888" 
  });
  gulp.watch("./less/**/*.less", ['less']);
  gulp.watch("./js/scripts.js", ['js']);
  gulp.watch("./img/svg/**/*.svg", ['svgsprites']);
  gulp.watch("./*.html").on('change', browserSync.reload);
});

/*=============================================
=            LESS and autoprefixer            =
=============================================*/
gulp.task('less', function () {
  return gulp.src( './less/**/style.less' )
    .pipe(sourcemaps.init())
    .pipe(less())
    .on('error', notify.onError(function(err) {
      return {
        title: 'Styles',
        message: err.message
      };
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./css' ))
    .pipe(browserSync.stream());
});

/*==================================
=            JavaScript            =
==================================*/
gulp.task('js', function() {
  return gulp.src( './js/**/*.js')
	  .pipe(gulp.dest( './js'))
    .pipe(browserSync.stream());
});
gulp.task('minify', ['less'], function() {
  return gulp.src( './css/*.css')
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest( './css/min/'));
});
gulp.task('gulp-autoprefixer', ['less'], function () {
  return gulp.src( '.css/style.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('dist'));
});

/*===========================
=            SVG            =
===========================*/
gulp.task('svgsprites', function() {
	gulp.src('./img/svg/**/*.svg')
		.pipe(svgsprites({
      shape: {
        dimension: {
          maxWidth: 32,
          maxHeight: 32,
          precision: 2
          //attributes: false
        }
      },
      mode: {
        symbol: {
          bust: false,
          sprite: 'inline-sprite.svg'
        }
      }
    }))
		.pipe(gulp.dest('./img/sprite'))
    .pipe(notify({
      message: 'SVG-sprite ready'
    }));
});

gulp.task('svgspriteless', function() {
  gulp.src('./img/svg/**/*.svg')
    .pipe(svgsprites({
      shape: {
        spacing: {
          padding: 1
        },
        dimension: {
          maxWidth: 32,
          maxHeight: 32,
          precision: 2
        }
      },
      mode: {
        css: {
          prefix: '.%s',
          dimensions: '%s',
          dest: './',
          sprite: 'sprite/sprite.svg',
          bust: false,
          render: {
            less: {
              dest: './less/sprite.less'
            }
          }
        },
      }
    }))
    .pipe(gulp.dest('./img/'));
});
/*==================================
=            PNG sprite            =
==================================*/
gulp.task('sprite', function generateSpritesheets () {
  // Use all normal and `-2x` (retina) images as `src`
  //   e.g. `github.png`, `github-2x.png`
  var spriteData = gulp.src('./img/png/**/*.png')
    .pipe(spritesmith({
      // Filter out `-2x` (retina) images to separate spritesheet
      //   e.g. `github-2x.png`, `twitter-2x.png`
      retinaSrcFilter: './img/png/**/*-2x.png',
      // Generate a normal and a `-2x` (retina) spritesheet
      imgName: 'sprite.png',
      retinaImgName: 'sprite-retina.png',
      // Optional path to use in CSS referring to image location
      imgPath: '../img/sprite/sprite.png',
      retinaImgPath: '../img/sprite/sprite-retina.png',
      // Generate SCSS variables/mixins for both spritesheets
      cssName: 'sprite.less'
    }));
  // Deliver spritesheets to `dist/` folder as they are completed
  spriteData.img.pipe(gulp.dest('./img/sprite/'));
  // Deliver CSS to `./` to be imported by `index.scss`
  spriteData.css.pipe(gulp.dest('./less/'));
});
//Image optimization

gulp.task('tinypng', function() {
  gulp.src('.img/png/*.{jpg,png}')
    .pipe(imagemin('2dywIYbcYicKNU11BDeWwgwbkWptRk6g'))
    .pipe(gulp.dest('.img/ready/'));
});

gulp.task('resize', function () {
  gulp.src('.img/png/*.png')
    .pipe(imageResize({ 
      format : 'jpg',
      filter: 'Catrom',
      imageMagick: true
    }))
    .pipe(gulp.dest('.img/mini/'))
    .pipe(notify({
      message: 'Finished otimize images'
    }));
});
//Image optimization

gulp.task('tinypng', function() {
  gulp.src('.img/png/*.{jpg,png}')
    .pipe(imagemin('2dywIYbcYicKNU11BDeWwgwbkWptRk6g'))
    .pipe(gulp.dest('.img/ready/'));
});

gulp.task('resize', function () {
  gulp.src('.img/png/*.png')
    .pipe(imageResize({ 
      format : 'jpg',
      filter: 'Catrom',
      imageMagick: true
    }))
    .pipe(gulp.dest('.img/mini/'))
    .pipe(notify({
      message: 'Finished otimize images'
    }));
});

/*==============================================================
=            Concatination and minification sctipts            =
==============================================================*/
gulp.task('scripts', function() {
  return gulp.src(
    [
    
    ])
    .pipe(concat('plugins.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./js/'))
    .pipe(notify({
      title: 'JavaScript',
      message: 'Finished minifying scripts'
    }));
});


gulp.task('default', ['watch']);