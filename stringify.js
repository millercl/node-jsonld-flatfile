var JSONLD = require( 'jsonld' )
var stringify = require( 'json-stable-stringify' )

module.exports = function ( jsonld, options, callback ) {
  var input
  if ( typeof arguments[0] === 'string' ) {
    input = JSON.parse( arguments[0] )
  }
  if ( typeof arguments[0] === 'object' ) {
    input = arguments[0]
  }

  var cmp = null
  var ctx = null
  var pre = nop
  var post = nop
  var replacer = null
  var space = 2
  if ( options && options.cmp ) {
    cmp = options.cmp
  }
  if ( options && options.ctx ) {
    ctx = options.ctx
  }
  if ( options && options.pre && typeof options.pre == 'function' ) {
    pre = options.pre
  }
  if ( options && options.post && typeof options.post == 'function' ) {
    post = options.post
  }
  if ( options && options.replacer ) {
    replacer = options.replacer
  }
  if ( options && options.space ) {
    space = options.space
  }

  pre( null
    , input
    , function ( error, jsonld ) {
        if ( !ctx ) {
          ctx = jsonld
        }
        JSONLD.flatten( jsonld, ctx, null, callpost )
      }
  )
  function callpost( err, jsonld ) {
    post( err, jsonld, cb )
  }
  function cb( err, compacted ) {
    var opts = {
      cmp: cmp
      , replacer: replacer
      , space: space
    }
    var o = stringify( compacted, opts ) + '\n'
    callback( err, o )
  }
}

function nop( error, jsonld, callback ) {
  callback( error, jsonld )
}
