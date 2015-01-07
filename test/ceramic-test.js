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
            var ceramic = new Ceramic();
            var typeCache = yield* ceramic.init([authorSchema, postSchema]);
            //TODO: asserts
        });
    });


    it("completeVirtualEntitySchema must complete the virtualEntitySchema", function() {
        return co(function*() {
            var ceramic = new Ceramic();
            var typeCache = yield* ceramic.init([authorSchema, postSchema]);
            //TODO: asserts
        });
    });


    it("init must create a type cache", function() {
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



    it("updateModel must create a type cache", function() {
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
