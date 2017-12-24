# jsonld-flatfile
![logo](https://github.com/millercl/node-jsonld-flatfile/raw/node-jsonld-flatfile/logo.png)

## Similar Projects
 * [jsonld-cli](https://github.com/digitalbazaar/jsonld-cli)
 * [json-stable-stringify](https://www.npmjs.com/package/json-stable-stringify)

## Q/A

### Why use `jsonld-flatfile` instead of `JSON.stringify`?
This package's stringification creates deterministic output from human-authored input.
Equivalent data results in equivalent serializations.
JavaScript implementations and some REPLs maintain an insertion order on `Object` properties.
`Object.keys` and `JSON.stringify` preserve that order in their output.
However, other REPLs and debuggers present `Object` properties ordered lexicographically.
The JSON-LD parser is indifferent to property order, and does not guarantee a stable sort on `Object` properties in output.
This package's stringification enforces a lexicographic sort order on `Object` properties by default.
Re-evaluated output is guareenteed line-by-line equivalence in text-editors and runtimes.
Modified output in SCM always has minimal changesets in diff reports; no extra lines due to an unstable sort.
Forgo meaningless peturbations and save time by sorting.

### Why does `stringify` use `jsonld.flatten`?
Flattened form gives a stable sort on node order: lexicographically by `@id` value.
It polarizes property direction by removing `@reverse` aliases and objects.
Flattened form is also compacted form; it's more amenable to editing than expanded form.

> Flattening collects all properties of a node in a single JSON object and labels all blank nodes with blank node identifiers.
> This ensures a shape of the data and consequently may drastically simplify the code required to process JSON-LD in certain applications.
> --[JSON-LD 1.0](http://www.w3.org/TR/2014/REC-json-ld-20140116/#flattened-document-form)

### What does the output look like?
```json
{
  "@context": {
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  },
  "@graph": [
    {
      "@id": "_:b0",
      "rdf:type": {
        "@id": "http://localhost/o"
      }
    }
  ]
}
```
**test/assets/src/default_graph.json**

See [JSON-LD Flattening](https://www.w3.org/TR/json-ld-api/#flattening)

### What should the input be?
With a single argument, the object should define the `@context` property.
Otherwise, use `options.ctx`.
Save test file in `node_modules/jsonld-flatfile/test/assets/src` and run:

```shell
cd node_modules/jsonld-flatfile
npm install
gulp proc
npm test
```

## Modules/API

### plugin
[stringify](#stringify) in a [vinyl](https://github.com/gulpjs/vinyl) [object transform](https://nodejs.org/api/stream.html#stream_class_stream_transform).

```js
var gulp = require( 'gulp' )
var stringify = require( 'jsonld-flatfile/plugin' )

gulp.task( 'myproc', function () {
    var proc = stringify().on( 'error', log_json )
    return gulp.src( [ 'test/assets/src/test.json' ] )
      .pipe( proc )
      .pipe( gulp.dest( 'test/assets/flatten1/' ) )
  }
)

function log_json() {
  var o = JSON.stringify( arguments[0], null, 2 )
  console.log( o )
}
```

### stringify
Flatten, compact, sort, and format JSON-LD as a `String` using `jsonld.flatten` and [json-stable-stringify](https://www.npmjs.com/package/json-stable-stringify), and append a newline.

```js
var stringify = require( 'jsonld-flatfile/stringify' )
```

#### stringify( jsonld, options, callback )
where:
  * `jsonld` is an Object or String
  * `options` is an Object with the optional properties:
    * `cmp`, a Function synchronously called during stringification (default null)
    * `ctx`, a JSON-LD context applied during compacting (default undefined, uses the jsonld parameter)
    * `pre`, a Function asynchronously called before stringification (default nop)
    * `post`, a Function asynchronously called after stringification (default nop)
    * `replacer`, a filtering Function or whitelist Array for `JSON.stringify` (default null)
    * `space`, the number of spaces to indent in `JSON.stringify` (default 2)
  * `callback` an asynchronous return function

and returns:
  * `undefined` / use a `callback` argument

#### options.cmp
passed through,
see [opts.cmp](https://www.npmjs.com/package/json-stable-stringify#cmp)

#### options.ctx
a [JSON-LD context](https://www.w3.org/TR/json-ld/#dfn-context) object

##### options.pre
must be a function with the signature:
```js
function ( error, json, callback )
  callback( error, json )
}
```
where:
 * `error` will always be `null`
 * `json` is an object instance
 * `callback` is a function back into `stringify`

and returns:
 * `undefined` / use `callback`

##### options.post
must be a function with signature:
```js
function ( error, jsonld, callback )
  callback( error, jsonld )
}
```
where:
 * `error` may contain parsing errors from JSON-LD
 * `jsonld` is an object instance
 * `callback` is a function back into `stringify`


##### options.replacer
passed through,
see [opts.replacer](https://www.npmjs.com/package/json-stable-stringify#replacer)

##### options.space
passed through,
see [opts.space](https://www.npmjs.com/package/json-stable-stringify#space)

