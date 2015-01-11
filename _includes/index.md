### Ceramic needs ES6 Generators

All ceramic projects use ES6 Generators instead of callbacks for async. So you'd have to run wth node with the --harmony flag or use regenerator to transpile code to ES5.

### Installation
{% highlight sh %}
npm install ceramic
{% endhighlight %}

### Usage
{% highlight javascript %}

var Author, BlogPost;
var authorSchema, postSchema;

var Ceramic = require("../lib/ceramic");

Author = function(params) {
    if (params) {
        for(var key in params) {
            this[key] = params[key];
        }
    }
};

authorSchema = {
    name: 'author',
    ctor: Author,
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

BlogPost = function(params) {
    if (params) {
        for(var key in params) {
            this[key] = params[key];
        }
    }
};

postSchema = {
    name: 'post',
    ctor: BlogPost,
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

var ceramic = new Ceramic();
var schemaCache = yield* ceramic.init([authorSchema, postSchema]);
var blogPostJSON = {
    title: "Busy Being Born",
    content: "The days keep dragging on, Those rats keep pushing on, ..",
    published: "yes",
    author: {
        name: "Middle Class Rut",
        location: "USA",
    }
};

var blogPost = yield* ceramic.constructEntity(blogPostJSON, postSchema);

console.log(blogPost instanceof BlogPost); //true
console.log(blogPost.author instanceof Author); //true

{% endhighlight %}



### Virtual Schemas

The beauty of document-based databases is that document structure is not necessarily rigid. We might use a single collection (or table) to store objects with differing schema, some of which may even be user-defined. For example, the Records collection might store objects of type text-posts, video-posts or short-stories.

Ceramic supports this through a concept called virtual-schemas. Virtual-schemas extend a base-schema with additional properties. To identify which virtual-schema to use, the base-schema must define a discriminator.
Objects created from the virtual-schemas will have their constructor set to that defined in the base-schema.

{% highlight javascript %}

// Note how the discriminator is defined.
// It uses the type property to find the virtual-schema
var songSchema = {
    name: 'ticket',
    discriminator: function*(obj, ceramic) {
        return yield* ceramic.getEntitySchema(obj.type);
    },
    schema: {
        type: 'object',
        properties: {
            title: { type: 'string' },
            artist: { type: 'string' },
            price: { type: 'number' },
            type: { type: 'string' }
        },
        required: ['title', 'artist']
    }
};

var mp3Schema = {
    name: "mp3",
    schema: {
        properties: {
            bitrate: { type: 'number' }
        },
        required: ['bitrate']
    }
};
var youtubeVideoSchema = {
    name: "youtube",
    schema: {
        properties: {
            url: { type: 'string' },
            highDef: { type: 'boolean' }
        },
        required: ['url', 'highDef']
    }
};

var ceramic = new Ceramic();

// ceramic.init(schemas, virtualSchemas)
// virtualSchemas is an array of virtualSchema definitions, as follows.
var schemaCache = yield* ceramic.init(
    [songSchema],
    [{ entitySchemas: [mp3Schema, youtubeVideoSchema], baseEntitySchema: songSchema }]
);

var mp3JSON = {
    "type": "mp3",
    "title": "Busy Being Born",
    "artist": "Middle Class Rut",
    "bitrate": 320
};

var mp3 = yield* ceramic.constructEntity(mp3JSON, songSchema, { validate: true });

{% endhighlight %}



### Validation
Ceramic currently does only basic validation.

- Type mismatch (eg: schema says age is a number, but got string)
- Required fields
- Array max length and min length
- Whether a property value is an instance of a class (eg: post.author instanceof Author)

{% highlight javascript %}

var ceramic = new Ceramic();
var typeCache = yield* ceramic.init([authorSchema, postSchema]);
var blogPost = new BlogPost({
    title: "Busy Being Born",
    content: "The days keep dragging on, Those rats keep pushing ..",
    published: "yes",
    author: new Author({
        name: "jeswin",
        location: "bangalore"
    })
});
var errors = yield* ceramic.validate(blogPost, postSchema);

console.log(errors.length); //Prints 0

{% endhighlight %}


### Dynamic Virtual Schemas

In addition to pre-defined schemas, Ceramic can dynamically load virtual-schemas from the disk.
