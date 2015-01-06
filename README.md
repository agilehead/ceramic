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

Ceramic also comes with two optional batteries, ceramic-db (https://github.com/jeswin/ceramic-db) and ceramic-http-parser (https://github.com/jeswin/ceramic-http-parser). Ceramic-db is an ODM (Object Document Mapper) with an ES6-Generators based API. Ceramic-http-parser parses an HTTP request and converts it into a complex-type using ceramic. 

## Let's get started

### Installation
npm install ceramic

### Create your schemas
```
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


