'use strict';

var gulp            = require('gulp'),
    concat          = require('gulp-concat'),
    gulpFilter      = require('gulp-filter'),
    order           = require('gulp-order'),
    mainBowerFiles  = require('main-bower-files'),
    sass            = require('gulp-sass'),
    rename          = require('gulp-rename'),
    csso            = require('gulp-csso'),
    autoprefixer    = require('gulp-autoprefixer'),
    spritesmith     = require('gulp.spritesmith'),
    imagemin        = require('gulp-imagemin'),
    pngquant        = require('imagemin-pngquant'),
    uglify          = require('gulp-uglify'),
    connect         = require('gulp-connect'),
    gaze            = require('gaze');
    // debug           = require('gulp-debug');


// Sprites
// ===========================================
gulp.task('sprites', function() {
    var spriteData = 
        gulp.src('./src/images/icons/*.png')
            .pipe(spritesmith({
                imgName: 'sprite.png',
                imgPath: '../images/sprite.png',
                cssName: '_sprite.sass',
                cssFormat: 'sass',
                algorithm: 'binary-tree'
            }));

    spriteData.img.pipe(gulp.dest('./dist/images/'));
    spriteData.css.pipe(gulp.dest('./src/sass/'))
        .pipe(connect.reload());
});

// Styles
// ===========================================
gulp.task('styles', function () {
    gulp.src('./src/sass/screen.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: [
                'last 2 versions',
                'firefox >= 4',
                'safari 7',
                'safari 8',
                'IE 8',
                'IE 9',
                'IE 10',
                'IE 11'
            ],
            cascade: false
        }))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(csso())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(connect.reload());
});

// Images
// ===========================================
gulp.task('images', function() {
    gulp.src(['./src/images/**/*.{png,jpg}', '!./src/images/{icons,icons/**}'])
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./dist/images'))
        .pipe(connect.reload());
});

// Scripts
// ===========================================
gulp.task('scripts', function() {
    gulp.src('./src/js/*.js')
        .pipe(order([
            'vendors.js',
            '**/*.js'
            ]))
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./dist/js/'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/js/'))
        .pipe(connect.reload());
});

// HTML
// ===========================================
gulp.task('html', function () {
    gulp.src('./src/html/*.html')
        .pipe(gulp.dest('./dist/'))
        .pipe(connect.reload());
        // TODO use jade
});

// Fonts
// ===========================================
gulp.task('fonts', function () {
    gulp.src('./src/fonts/*.*')
        .pipe(gulp.dest('./dist/fonts/'))
        .pipe(connect.reload());
});

// Bower libs
// ===========================================
gulp.task('libs', function () {
    var vendors = mainBowerFiles();
    var shivFilter = gulpFilter('html5shiv.js', {restore: true});
    var jsFilter = gulpFilter(['*.js', '!html5shiv.js'], {restore: true});
    var cssFilter = gulpFilter(['*.css', 'normalize.css'], {restore: true});
    var fontFilter = gulpFilter(['*.eot', '*.woff', '*.svg', '*.ttf']);
    return gulp.src(vendors)
    // HTML5Shiv
    .pipe(shivFilter)
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/js/'))
    .pipe(connect.reload())
    .pipe(shivFilter.restore)
    // JS filter
    .pipe(jsFilter)
    .pipe(order([
        'jquery.js',
        '**/*.js'
        ]))
    .pipe(concat('vendors.js'))
    .pipe(gulp.dest('./src/js/'))
    .pipe(connect.reload())
    .pipe(jsFilter.restore)
    // CSS filter
    .pipe(cssFilter)
    .pipe(concat('_libs.scss'))
    .pipe(gulp.dest('./src/sass/'))
    .pipe(connect.reload())
    .pipe(cssFilter.restore)
    // Fonts filter
    .pipe(fontFilter)
    .pipe(gulp.dest('./dist/fonts/'))
    .pipe(connect.reload());
});

// Server
// ===========================================
gulp.task('connect', function() {
    connect.server({
        port: 8000,
        root: 'dist',
        livereload: true
    });
});

// Watch
// ===========================================
gulp.task('watch', function() {
    // Bower
    gaze('bower.json', function() {
        this.on('all', function() {
            gulp.start('libs');
        });
    });
    // Styles
    gaze('./src/sass/**/*.{sass,scss}', function() {
        this.on('all', function() {
            gulp.start('styles');
        });
    });
    // HTML
    gaze('./src/html/*.html', function() {
        this.on('all', function() {
            gulp.start('html');
        });
    });
    // Fonts
    gaze('./src/fonts/*.*', function() {
        this.on('all', function() {
            gulp.start('fonts');
        });
    });
    // Scripts
    gaze('./src/js/*.js', function() {
        this.on('all', function() {
            gulp.start('scripts');
        });
    });
    // Sprites
    gaze('./src/images/icons/**/*.png', function() {
        this.on('all', function() {
            gulp.start('sprites');
        });
    });
    // Images
    gaze(['./src/images/**/*.{png,jpg}', '!./src/images/{icons,icons/**}'], function() {
        this.on('all', function() {
            gulp.start('images');
        });
    });
});

// Default
// ===========================================
gulp.task('default', function() {
    gulp.start('connect');
    gulp.start('images');
    gulp.start('libs');
    gulp.start('styles');
    gulp.start('html');
    gulp.start('fonts');
    gulp.start('scripts');
    gulp.start('sprites');
    gulp.start('watch');
});