'use strict';
var Content = require('@hapi/content'),    
    Parser = require('./parser'),
    pkg = require('../package.json');



exports.plugin = {
    name: pkg.name,
    version: pkg.version,
    pkg: pkg,
    register: (server, options) => {

        var v = Parser.__SCHEMA.validate(options);
        options = Object.assign({}, Parser.__DEFAULTS, v.value);

        // decorate the request with a `body` property
        server.decorate('request', 'body', function () { return {} }, { apply: true });

        server.ext('onPostAuth', (request, h) => {
            var type = request.headers['content-type'];
            if (type && (/post|put|delete|patch|options/ig).test(request.method)) {
                var opts = request.route.settings.plugins.body;
                if (opts) {
                    v = Parser.__SCHEMA.validate(opts);
                    options = Object.assign({}, options, v.value);
                }

                var mime = Content.type(type).mime;
                if (mime === 'multipart/form-data' || mime === 'application/x-www-form-urlencoded') {
                    Parser.parse(request, options);
                }
            }

            return h.continue;
        });
    }
    
}