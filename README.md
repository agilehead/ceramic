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
var blogPost = ceramic.constructModel(postJSON, schema);
//blogPost.constructor === BlogPost (true)
//blogPost.author.constructor === Author (true)
```

Ceramic also comes with two optional batteries, ceramic-db (https://github.com/jeswin/ceramic-db) and ceramic-http-parser (https://github.com/jeswin/ceramic-http-parser). Ceramic-db is an ODM (Object Document Mapper) with a clean ES6-Generators based API. Ceramic-http-parser parses an HTTP request and converts it into a complex-type using ceramic. 


Getting Started
---------------

