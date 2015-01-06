Ceramic
=======
Ceramic can convert a simple object (fetched via JSON) into a complex-type (entity) based on associated JSON schema. It can also validate an entity against its schema. 

Why use it? You might need to convert the JSON representing a blog post into an object called post, where post.constructor === Post and post.author.constructor === Author. 

Ceramic also comes with two optional batteries, ceramic-db (https://github.com/jeswin/ceramic-db) and ceramic-http-parser (https://github.com/jeswin/ceramic-http-parser). Ceramic-db is an ODM (Object Document Mapper) with a clean ES6-Generators based API. Ceramic-http-parser parses an HTTP request and converts it into a complex-type using ceramic. 




Getting Started
---------------

