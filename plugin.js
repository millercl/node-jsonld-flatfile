var buffer = require( 'buffer' )
var stream = require( 'stream' )
var fs = require( 'fs' )
var stringify = require( './stringify' )

module.exports = function ( options ) {
  var transform = new stream.Transform( { objectMode: true } )
  transform._transform = function ( vinyl, encoding, callback ) {
    if ( vinyl.isNull() ) {
      callback( null, vinyl )
    }
    if ( vinyl.isBuffer() ) {
      stringify( vinyl.contents.toString(), options, buffer )
    }
    function buffer( err, o ) {
      if ( err ) {
        vinyl.contents = null
        err.path = vinyl.path
      } else {
        vinyl.contents = new Buffer( o )
      }
      callback( err, vinyl )
    }
  }
  return transform
}
