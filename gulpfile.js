/******************************Пути*************************************/
var npmDir           = './node_modules',
    main_src         = './assets',
    dirHtml_src      = './templates',
    dirStyles_src    = main_src+'/styles',
    dirScripts_src   = main_src+'/scripts',
    dirImg_src       = main_src+'/images',
    dirFonts_src     = main_src+'/fonts',

    main_dist        = './dist',
    dirHtml_dist     = main_dist,
    dirStyles_dist   = main_dist+'/css',
    dirScripts_dist  = main_dist+'/js',
    dirImg_dist      = main_dist+'/images',
    dirFonts_dist    = main_dist+'/fonts';

/**************************Зависимости*************************************/
var gulp          = require('gulp'),
    sass          = require('gulp-sass'),
    sourcemaps    = require('gulp-sourcemaps');
    browserSync   = require("browser-sync"),
    concat        = require('gulp-concat'),
    uglify        = require('gulp-uglify'),
    cssnano       = require('gulp-cssnano'),
    rename        = require('gulp-rename'),
    del           = require('del'),
    imagemin      = require('gulp-imagemin'),
    pngquant      = require('imagemin-pngquant'),
    cache         = require('gulp-cache'),
    autoprefixer  = require('gulp-autoprefixer'),
    postcss       = require('gulp-postcss'),
    postcssShortS = require('postcss-short-size');
    htmlmin       = require('gulp-htmlmin'),
    inlineCss     = require('gulp-inline-css'),
    nunjucks      = require('gulp-nunjucks'),
    nunjucksRender= require('gulp-nunjucks-render'),
    wait          = require('gulp-wait'),
    plumber       = require('gulp-plumber');

/**************************Компиляция SASS*************************************/
gulp.task('sass', function() {
    return gulp.src(dirStyles_src + '/*.{sass,scss}')
        .pipe(plumber())
        .pipe(wait(500))
        .pipe(
            sass({
                outputStyle: 'compressed'
            })
        )
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([
            require('postcss-size'),
            postcssShortS()
        ]))
        .pipe(autoprefixer( ['last 25 versions', 'ie 8', 'ie 7'], { cascad: true }))
        /*.pipe(postcss({
            html: ['index.html', '.**!/!*.html']
        }))*/
        .pipe(concat('app.css'))
        .pipe(gulp.dest(dirStyles_dist))
        .pipe(concat("app.min.css"))
        .pipe(gulp.dest(dirStyles_dist))
        .pipe(browserSync.reload({stream: true}));
});


/**************************Vendor JS*******************************************/
gulp.task('scripts_libs', function() {
    return gulp.src([
        npmDir + '/jquery/dist/jquery.min.js',
        npmDir + '/swiper/dist/js/swiper.min.js',
        npmDir + '/aos/dist/aos.js',
    ])
        .pipe(plumber())
        .pipe(concat('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dirScripts_dist));
});
/**************************main JS*******************************************/
gulp.task('scripts_main', function() {
    return gulp.src(dirScripts_src + '/*.js')
        .pipe(wait(500))
        .pipe(plumber())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dirScripts_dist));
});


gulp.task("css-libs", function () {
  return gulp.src([
        npmDir + '/reset-css/reset.css',
        npmDir + '/swiper/dist/css/swiper.css',
        npmDir + '/aos/dist/aos.css',
  ])
    .pipe(concat("vendor.min.css"))
    .pipe(gulp.dest(dirStyles_dist));
});


gulp.task('clean', function(){
    return del.sync(main_dist);
});

gulp.task('cleare', function(){
    return cache.clearAll();
});

/**************************Уменьшение изображений******************************/
gulp.task('img', function(){
    return gulp.src([
        dirImg_src+'/**/*',
    ])
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest(dirImg_dist));
});

/************************************Replase fonts******************************/
gulp.task('fonts', function() {
  return gulp.src(dirFonts_src+'/**/*')
    .pipe(gulp.dest(dirFonts_dist));
});

/**************************************Сжатие html******************************/
gulp.task('minify_html', function() {
    return gulp.src(dirHtml_src+'/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(main_dist));
});
/***********************************template html******************************/
gulp.task('nunjucks-render', function () {
    return gulp.src(dirHtml_src + '/*.html')
        .pipe(nunjucksRender({
            path: [dirHtml_src] // String or Array
        }))
        .pipe(gulp.dest(dirHtml_dist));
});

/*******************************Обработчик ошибок******************************/
function log(error) {
    console.log([
        '',
        "----------ERROR MESSAGE START----------".bold.red.underline,
        ("[" + error.name + " in " + error.plugin + "]").red.bold.inverse,
        error.message,
        "----------ERROR MESSAGE END----------".bold.red.underline,
        ''
    ].join('\n'));
    this.end();
}

/**************************Browser Sync****************************************/
gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: main_dist
        },
        notify: false
    });

    gulp.watch([dirStyles_src + '/**/*.{sass,scss}'], ['sass']).on("change", browserSync.reload);
    gulp.watch([dirImg_src]).on("change", browserSync.reload);
    gulp.watch([dirScripts_src + '/**/*.js']).on("change", browserSync.reload);
    gulp.watch([dirFonts_src], ["fonts"]).on("change", browserSync.reload);
    gulp.watch([dirHtml_src + "/**/*"]).on("change", browserSync.reload);
});


gulp.task('build-stack', ['sass', 'img', 'css-libs', 'scripts_main', 'scripts_libs', 'fonts']);

/*************************************Dev WATCH************************************/
gulp.task('dev', ['browser-sync', 'nunjucks-render', 'build-stack'], function () {
    gulp.watch([dirStyles_src + '/**/*.{sass,scss}'], ['sass']);
    gulp.watch([dirScripts_src+'/**/*.js'], ["scripts_main"]);
    // gulp.watch([dirImg_src + "/**/*"]);
    gulp.watch([dirImg_src], ["img"]);
    gulp.watch([dirFonts_src], ["fonts"]);
    gulp.watch([dirHtml_src + '/**/*.html'],['nunjucks-render']);
});



/*************************************Prod Build***********************************/
gulp.task('build', ['clean', 'build-stack']);
