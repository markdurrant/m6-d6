// Plugins
var     gulp = require( 'gulp' ),
       gutil = require( 'gulp-util' ),
      rename = require( 'gulp-rename' ),
        path = require( 'path' ),
     connect = require( 'connect' ),
          lr = require( 'tiny-lr' ),
  livereload = require( 'gulp-livereload' ),
      server = lr(),
     embedlr = require( "gulp-embedlr" ),
      jshint = require( "gulp-jshint" ),
     stylish = require( 'jshint-stylish' );
      uglify = require( 'gulp-uglify' ),
        sass = require( 'gulp-sass' ),
      prefix = require( 'gulp-autoprefixer' ),
      svgmin = require( 'gulp-svgmin' ),
    imagemin = require( 'gulp-imagemin' ),
       clean = require( 'gulp-clean' ),
 runSequence = require( 'run-sequence' );

// source and distribution folders
var  src = 'src/';
var dist = path.resolve( 'dist/' );

// localhost port
var LocalPort = 4000;

// start local server
gulp.task( 'server', function() {
  connect.createServer(
      connect.static( dist )
  ).listen( LocalPort );

  console.log( "\nlocal server runing at http://localhost:" + LocalPort + "/\n" );
});

// add liveReload script
gulp.task( 'embedlr', function() {
  gulp.src( src + "*.html" )
    .pipe( embedlr() )
    .pipe( gulp.dest( dist ) )
    .pipe( livereload( server ) );
});

// complie sass & add vendor prefixes
gulp.task( 'css', function() {
  gulp.src( src + 'sass/*.scss' )
    .pipe( sass({
      outputStyle: [ 'compressed' ],
      errLogToConsole: true
    }))
    .pipe( prefix() )
    .pipe( gulp.dest( dist + '/css' ) )
    .pipe( livereload( server ) );
});

// clean /dist for build task
gulp.task( 'clean', function() {
  return gulp.src( dist, { read: false } )
    .pipe( clean() );
});

// build all assets
gulp.task( 'build', function() {
  return gulp.run( 'embedlr', 'css');
});

// watch & liveReload
gulp.task( 'watch', function() {
  server.listen( 35729, function ( err ) {
    if ( err ) return console.log( err );

    gulp.watch( src + '*.html', function() {
      gulp.run( 'embedlr' );
    });

    gulp.watch( src + 'sass/*.scss', function() {
      gulp.run( 'css' );
    });

  });
});

// default task
gulp.task( 'default', function(callback){
  runSequence( 'clean', 'build', ['server', 'watch'], callback );
});