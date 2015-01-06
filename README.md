Ceramic
=======
Based on JSON-Schema, ceramic can map simple JSON into traversable entities that the application logic uses.

This is best explained with an example. Assume you fetched the following blog post data from the DB or a Web Service:
```
var postJSON = {
  "title": "Intro to Node.JS",
  "content": ".....",
  "published": "12-12-2014",
  "author": {
    "id": "jeswin",
    "location": "Bangalore"
  }
}
```

Ceramic can convert this into domain entities your application uses, such as BlogPost and Author.
```
var blogPost = yield* ceramic.constructModel(postJSON, schema);
//blogPost.constructor === BlogPost (true)
//blogPost.author.constructor === Author (true)
```

Ceramic also comes with two optional batteries, ceramic-db (https://github.com/jeswin/ceramic-db) and ceramic-http-parser (https://github.com/jeswin/ceramic-http-parser). Ceramic-db is an Object Document Mapper (ODM). Ceramic-http-parser parses an HTTP request and converts it into a complex-type using ceramic. 

All ceramic projects use ES6 Generators instead of callbacks for async. So you'd have to run with node with the --harmony flag or use regenerator to transpile code into to ES5. 

## Let's get started

### Installation
npm install ceramic

### Usage
```
var Ceramic = require("ceramic");

var Author = function() {
  //constructor
};

var authorSchema = {
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

var BlogPost = function() {
  //constructor
};

var postSchema = {
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

//We have to init ceramic and provide the schemas
var ceramic = new Ceramic();
yield* ceramic.init([authorSchema, postSchema]);

//pull some data from your favorite "web-scale" database
var blogPostJSON = yield* blogService.get("112");
var blogPost = yield* ceramic.constructModel(blogPostJSON, postSchema);

//Yaay, we have a domain entity!
console.log(blogPost.constructor === BlogPost);
```

### Validation
ceramic currently does only basic validation.
- Type mismatch (eg: schema says age is a number, but got string)
- Required fields
- Array max length and min length
- Whether a property value was constructed with the right constructor (eg: post.author.constructor === Author)

```
//Returns true/false based on whether the object matches JSON schema
ceramic.validate(someObject, schema);
```

### Virtual Types

The beauty of document-based databases is that document structure is not necessarily rigid. We might use a single collection (or table) to store objects with differing schemas, some of which may even be user-defined. For example, the Records collection might store objects of type text-posts, video-posts or short-stories.  

Ceramic supports this through a concept called virtual-schemas. Virtual-schemas extend a base-schema with additional properties. To identify which virtual-schema to use, the base-schema must define a discriminator. 
Objects created from the virtual-schemas will have their constructor set to that defined in the base-schema.

Here is an example:
```
var recordSchema = {
    name: 'record',
    discriminator: function*(obj, ceramic) {
      return yield* ceramic.getTypeDefinition(obj.recordType);
    },
    schema: {
        type: 'object',
        properties: {
            uniqueId: { type: 'string' },
            createdBy: { $ref: 'user' },
            recordType: { type: 'string' }
        },
        required: ['uniqueId', 'createdBy']
    }
};

var textPostSchema = {
  "name": "text-post",
  "schema": {
      "type": "object",
      "properties": {
          "title": { "type": "string", "maxLength": 200 },
          "subtitle": { "type": "string", "maxLength": 200 },
          "content": { "type": "string", "maxLength": 2000 }
      },
      "required": ["title", "content"]
  }
}

var videoPostSchema = {
  "name": "video-post",
  "schema": {
      "type": "object",
      "properties": {
          "title": { "type": "string", "maxLength": 200 },
          "url": { "type": "string", "maxLength": 200 }
      },
      "required": ["title", "url"]
  }
}

var ceramic = new Ceramic();
yield* ceramic.init(
  [recordSchema],
  [{ typeDefinitions: [textPostSchema, videoPostSchema], baseTypeDefinition: recordSchema }]
);

var records = [];
var recordsJSON = yield* recordsService.getAll();
for (var i = 0; i < recordsJSON.length; i++) {
  records.push(yield* ceramic.constructModel(recordsJSON[i], recordSchema);
}
// records[0] might be a text-post, records[1] might be a "video-post" etc.
// This is automatically handled.
```

