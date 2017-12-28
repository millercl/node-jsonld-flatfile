var gulp = require( 'gulp' )
var del = require( 'del' )
var jscs = require( 'gulp-jscs' )
var jshint = require( 'gulp-jshint' )
var jsonlint = require( 'gulp-jsonlint' )
var plugin = require( './plugin' )
var runSequence = require( 'run-sequence' )
var stylish_jshint = require( 'jshint-stylish' )
var stylish_jscs = require( 'gulp-jscs-stylish' )

var paths = {
    js: [ '*.js', 'lib/*.js', 'test/*.js' ]
    , json: 'package.json'
    , src: 'test/assets/src/*.json'
    , fail: 'test/assets/fail/*.json'
    , flatten1: 'test/assets/flatten1/'
    , flatten2: 'test/assets/flatten2/'
  }

gulp.task( 'default'
  , function () {
      runSequence( 'proc' )
    }
)

gulp.task( 'src'
 , function () {
    runSequence( 'lint', 'style' )
  }
)

gulp.task( 'lint'
 , function () {
    gulp.src( [ paths.json, paths.src ] )
      .pipe( jsonlint() )
      .pipe( jsonlint.reporter() )
      .pipe( jsonlint.failAfterError() )
  }
)

gulp.task( 'style'
 , function () {
    gulp.src( paths.js, { base: './' } )
      .pipe( jshint() )
      .pipe( jshint.reporter( 'jshint-stylish' ) )
      .pipe( jscs( { fix: false } ) )
      .pipe( stylish_jscs() )
      .pipe( gulp.dest( './' ) )
  }
)

gulp.task( 'flatten1'
 , function () {
    return gulp.src( [ paths.src ] )
      .pipe( plugin( null ) )
      .pipe( gulp.dest( paths.flatten1 ) )
  }
)

gulp.task( 'flatten2'
 , function () {
    var unit = plugin().on( 'error', log_json )
    gulp.src( paths.flatten1 + '*.json' )
      .pipe( unit )
      .pipe( gulp.dest( paths.flatten2 ) )
  }
)

gulp.task( 'clean'
 , function () {
    del( [ paths.flatten1, paths.flatten2 ] )
  }
)

gulp.task( 'proc'
 , function () {
    runSequence( 'clean', 'flatten1', 'flatten2' )
  }
)

function log_json() {
  var o = JSON.stringify( arguments[0], null, 2 )
  console.log( o )
}
