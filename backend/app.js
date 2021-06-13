var express = require('express');
var post = require('./routes/posts.js');

var app = express();

var cors = require('cors');

//.use is a middleware function (middleware = access to req, resp and their respective bodies)
// this one is not mounted to a route. It gets called on every request
// json is a middleware to handle json bodies
app.use(express.json());
app.use('/posts', post.router);
app.listen(3000)