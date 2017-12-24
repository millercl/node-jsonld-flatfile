// Copyright (C) 2016, 2017 by Doublethink LLC

// This file is part of jsonld-persistence.

// jsonld-persistence is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// jsonld-persistence is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with jsonld-persistence.  If not, see <http://www.gnu.org/licenses/>.

var fs = require( 'fs' )
var path = require( 'path' )
var stringify = require( '../stringify.js' )
var test = require( 'tape' )

var paths = {
  fail: 'test/assets/fail/'
  , flatten1: 'test/assets/flatten1/'
  , flatten2: 'test/assets/flatten2/'
  , src: 'test/assets/src/'
  , ctx: 'test/assets/ctx/'
}

test( 'json object argument'
  , function ( t ) {
      var _path = './' + path.join( paths.flatten1, 'default_graph.json' )
      var flatten1 = JSON.parse( fs.readFileSync( _path ).toString() )
      var expected = fs
        .readFileSync( path.join( paths.flatten2, 'default_graph.json' ) )
        .toString()
      stringify(
          flatten1
        , {
            cmp: c
            , replacer: yes
            , space: 2
          }
        , function ( error, flatten2 ) {
            t.equals( flatten2, expected )
            t.end()
          }
      )
      function c( a, b ) {
        return a.key > b.key ? 1 : -1
      }
      function yes() {
        return arguments[1]
      }
    }
)

test( 'options.pre'
  , function ( t ) {
      var _path = './' + path.join( paths.flatten1, 'default_graph.json' )
      var flatten1 = JSON.parse( fs.readFileSync( _path ).toString() )
      var expected = fs
        .readFileSync( path.join( paths.flatten2, 'default_graph.json' ) )
        .toString()
      var expected_inst = JSON.parse( expected )
      t.plan( 2 )
      function pre( err, res, cb ) {
        t.deepEquals( res, expected_inst )
        cb( err, res )
      }
      var options = { pre: pre }
      stringify( flatten1, options, cb )
      function cb( err, json ) {
        t.deepEqual( json, expected )
        t.end()
      }
    }
)

test( 'options.post'
  , function ( t ) {
      var _path = './' + path.join( paths.flatten1, 'default_graph.json' )
      var flatten1 = JSON.parse( fs.readFileSync( _path ).toString() )
      var expected = fs
        .readFileSync( path.join( paths.flatten2, 'default_graph.json' ) )
        .toString()
      var expected_inst = JSON.parse( expected )
      t.plan( 2 )
      function post( err, res, cb ) {
        t.deepEquals( res, expected_inst )
        cb( err, res )
      }
      var options = { post: post }
      stringify( flatten1, options, cb )
      function cb( err, json ) {
        t.deepEqual( json, expected )
        t.end()
      }
    }
)

function ext( e ) {
  var r = /.*\.json$/
  return r.test( e )
}

var files = fs.readdirSync( paths.src )
files.filter( ext ).forEach( object_diff )
files.filter( ext ).forEach( string_diff )

function object_diff( filename ) {
  var actual = {}
  var expected = {}
  expected.path = path.join( paths.src, filename )
  actual.path = path.join( paths.flatten1, filename )
  expected.json = JSON.parse( fs.readFileSync( expected.path ).toString() )
  actual.json = JSON.parse( fs.readFileSync( actual.path ).toString() )
  test( filename
      , function ( t ) {
          t.deepEqual( actual.json, expected.json, 'object inequality' )
          t.end()
        }
  )
}

function string_diff( filename ) {
  var actual = {}
  var expected = {}
  expected.path = path.join( paths.flatten1, filename )
  actual.path = path.join( paths.flatten2, filename )
  expected.string = fs.readFileSync( expected.path ).toString()
  actual.string = fs.readFileSync( actual.path ).toString()
  test( filename
      , function ( t ) {
          t.equal( actual.string, expected.string, 'string inequality' )
          t.end()
        }
    )
}

test( 'options.ctx'
  , function ( t ) {
      var ctx_path = path.join( paths.ctx, 'context.json' )
      var doc_path = path.join( paths.ctx, 'document.json' )
      var exp_path = path.join( paths.ctx, 'combined.json' )

      var ctx_buf = fs.readFileSync( ctx_path )
      var doc_buf = fs.readFileSync( doc_path )
      var exp_buf = fs.readFileSync( exp_path )

      var ctx_obj = JSON.parse( ctx_buf )
      var doc_obj = JSON.parse( doc_buf )
      var exp_obj = JSON.parse( exp_buf )

      var options = { ctx: ctx_obj }
      stringify( doc_obj, options, cb )
      function cb( err, json ) {
        t.deepEqual( json, exp_buf.toString() )
        t.end()
      }
    }
)
