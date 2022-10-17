'use strict';

var Hoek = require('@hapi/hoek'),
    Joi = require('@hapi/joi'),
    url = require('url'),
    qs = require('qs');

module.exports = {
    __SCHEMA: Joi.object().keys({
        parser: Joi.object(),
        sanitizer: Joi.object().keys({
            trim: Joi.boolean(),
            stripNullorEmpty: Joi.boolean()
        }).allow(null),
        body: Joi.boolean(),
        merge: Joi.boolean()
    }),
    __DEFAULTS: {
        parser: { allowDots: true, strictNullHandling: true },
        sanitizer: {
            trim: true,
            stripNullorEmpty: true
        },
        body: false,
        merge: false
    },
    isObject: function (obj) {
        if (obj && obj.toString && obj.toString() === '[object Object]')
            return true;

        return false;
    },

    isEmptyObject: function (obj) {
        return this.isObject(obj) && Object.keys(obj).length == 0;       
    },

    isNullOrUndefined: function (s) {
        return s === null || s === undefined;
    },
    isEmpty: function (s) {
        return this.isNullOrUndefined(s) ? true : /^[\s\xa0]*$/.test(s);
    },
    isString: function (val) {
        return typeof val === 'string' || ((!!val && typeof val === 'object') && Object.prototype.toString.call(val) === '[object String]');
    },
    sanitize: function (obj, opts) {
        if (!this.isObject(obj))
            return obj;
        var $ = this;
        Object.keys(obj).forEach(function (key) {
            var val = obj[key];
            if ($.isObject(val)) {
                obj[key] = $.sanitize(val, opts);
            } else if (opts.stripNullorEmpty && $.isNullOrUndefined(val)) {
                delete obj[key];
            }
            else if ($.isString(val)) {
                if (opts.trim)
                    obj[key] = val = val.trim();
                if (opts.stripNullorEmpty && $.isEmpty(val)) {
                    delete obj[key];
                }
            }
        });

        return obj;

    },
    parse: function (request, opts) {
        var body = qs.parse(request.payload, opts.parser);
        if (opts.merge) {
            var uri = url.parse(request.url, false);
            var query = qs.parse(uri.query, opts.parser);
            body = Hoek.merge(query, body);
        }
        if (opts.sanitizer) {
            body = this.sanitize(body, opts.sanitizer);
        }

        if (opts.body) {
            request.body = body;
        } else {
            request.payload = body;
        }

    }
}