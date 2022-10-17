# hapi-bodyparser

Hapi.js body parsing plugin support merge querystring, sub objects and sanitizer.

Parse incoming request bodies in a plugin before your handlers, available under the request.payload (body: true --> request.body) property.

### If you don't know Node.js 

[Node.js Tutorial for Beginners in 2020](https://morioh.com/p/0907cef2141c)

[How To Build a Blog with Nest.js, MongoDB, and Vue.js](https://morioh.com/p/74ffc8a798bb)

[Machine Learning In Node.js With TensorFlow.js](https://morioh.com/p/a517bc403340)

```js
npm install hapi-bodyparser --save
```

```js
// Not set if you want default options
options: {
    // parser options use qs.parse(value, options)
    parser: { allowDots: true, strictNullHandling: true },
    sanitizer: {
        trim: true, // remove first || end white space of String
        stripNullorEmpty: true // remove property when Null or Empty
    },        
    merge: false, // merge querystring into body
    body: false // If false: request.payload is default parsed | if true request.body is parsed
}

```

```js
var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({ port: 8080, host: 'localhost' });

server.register([{
    register: require('hapi-bodyparser'),
    options: {
        // parser: { allowDots: true, strictNullHandling: true },
        // sanitizer: {
        //     trim: true,
        //     stripNullorEmpty: true 
        // },
        // merge: false, 
        // body: false 
    }
}], function (err) {
    // Insert your preferred error handling here...
});

```

Options can be configured on a route via the `body` plugin object.

```js
server.route({
  method: 'POST',
  path: '/api/post/fetch',
  options: {
    plugins: {
      body: { merge: false, sanitizer: { stripNullorEmpty: false } }
    },
    handler: function (request, reply) {
      reply(request.payload);
    }
  }
});
```

Parsing sub object for validate dynamic object keys name
```js
server.route({
        method: 'POST',
        path: '/api/post/fetch',
        options: {

            auth: {
                strategy: 'session',
                mode: 'try'
            },

            validate: {
                payload: {
                    limit: Joi.number(),
                    offset: Joi.number(),                                       
                    sort: Joi.object().pattern(/.*/, Joi.alternatives().try(Joi.number(), Joi.boolean(), Joi.string())),                   
                    search: Joi.string().allow('')
                }
            },            

            handler: (request, reply) => {
                var _uid = request.auth.credentials._id;
                var _limit = request.payload.limit;
                var _offset = request.payload.offset;
                var _sort = request.payload.sort; 
                var _kwd = request.payload.search;
                var _condition = [{ _uid: _uid }];

                if(_kwd.length>0){
                    _condition.push({
                        $or: [
                            { tl: new RegExp(_kwd, "ig") },
                            { desc: new RegExp(_kwd, "ig") }                            
                        ]
                    })
                }
                             

                Post.paginate({ $and: _condition }, {
                    offset: _offset,
                    limit: _limit,                    
                    sort: _sort
                },
                    function (err, result) {

                        if (result) {
                            reply({
                                total: result.total,
                                rows: result.docs
                            });
                        } else {
                            reply({ total: 0, rows: [] });
                        }

                    });

            }
        }
});
```

With option `merge: true`, merge querystring into payload (body).

```js
server.route({
  method: 'POST',
  path: '/api/post/fetch?abc=1',
  options: {
    plugins: {
      body: { merge: true }
    },
    handler: function (request, reply) {
      reply(request.payload);
      // return {abc: 1, ...}
    }
  }
});
```

Option sanitizer help clean object properties.

```js
// with default options: trim: true and stripNullorEmpty: true
{
    a: '  Hello  ',
    b: '',
    c: null,
    d: 'World   ',
    e: {
        a: null,
        b: 1,
        c:''
    }
}
// after sanitize
{
    a: 'Hello',
    d: 'World',
    e: {
        b: 1
    }
}

``` 