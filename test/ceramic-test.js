var co = require('co');

describe("Ceramic Core", function() {
    var Author, BlogPost;
    var authorSchema, postSchema;
    var Ceramic;

    before(function() {
        return co(function*() {
            Ceramic = require("../lib/ceramic");

            var Author = function(params) {
                for(var key of params) {
                    this[key] = params[key];
                }
            };

            authorSchema = {
                name: 'author',
                schema: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        location: { type: 'string' },
                        age: { type: 'number' }
                    },
                    required: ['name', 'location']
                }
            };

            authorSchema.ctor = Author;

            BlogPost = function(params) {
                for(var key of params) {
                    this[key] = params[key];
                }
            };

            postSchema = {
                name: 'post',
                schema: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        content: { type: 'string' },
                        published: { type: 'string' },
                        author: { $ref: 'author' }
                    },
                    required: ['title', 'content', 'author']
                }
            };

            postSchema.ctor = BlogPost;

        });
    });


    it("completeEntitySchema must complete the entitySchema", function() {
        return co(function*() {
            var songSchema = {
                name: 'ticket',
                schema: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        artist: { type: 'string' },
                        price: { type: 'number' }
                    },
                    required: ['title', 'artist']
                }
            };

            var ceramic = new Ceramic();
            var entitySchema = ceramic.completeEntitySchema(songSchema);
            //TODO: asserts
        });
    });


    it("completeVirtualEntitySchema must complete the virtualEntitySchema", function() {
        return co(function*() {
            var songSchema = {
                name: 'ticket',
                schema: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        artist: { type: 'string' },
                        price: { type: 'number' }
                    },
                    required: ['title', 'artist']
                }
            };

            var mp3Schema = {
                schema: {
                    properties: {
                        bitrate: { type: 'number' }
                    }
                },
                required: ['bitrate']
            };

            var ceramic = new Ceramic();
            var entitySchema = ceramic.completeVirtualEntitySchema(mp3Schema, songSchema);
            //TODO: asserts
        });
    });


    it("init must create a schema cache", function() {
        return co(function*() {
            var ceramic = new Ceramic();
            var typeCache = yield* ceramic.init([authorSchema, postSchema]);
            //TODO: asserts
        });
    });


    it("constructModel must create a construct a model", function() {
        return co(function*() {
            var ceramic = new Ceramic();
            var typeCache = yield* ceramic.init([authorSchema, postSchema]);
            //TODO: asserts
        });
    });



    it("updateModel must create a schema cache", function() {
        return co(function*() {
            var ceramic = new Ceramic();
            var typeCache = yield* ceramic.init([authorSchema, postSchema]);
            //TODO: asserts
        });
    });


    it("validate must compare entity against an entitySchema", function() {
        return co(function*() {
            var ceramic = new Ceramic();
            var typeCache = yield* ceramic.init([authorSchema, postSchema]);
            //TODO: asserts
        });
    });


    after(function() {
        return co(function*() {
            var a = 1;
        });
    });
});
