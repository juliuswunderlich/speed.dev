const express = require('express')

const app = express();

const cors = require('cors');

//.use is a middleware function (middleware = access to req, resp and their respective bodies)
// this one is not mounted to a route. It gets called on every request
// json is a middleware to handle json bodies
app.use(express.json());
app.use(cors());
const postRoutes = require('./routes/posts.js');
import './db/db.js';
app.use('/posts', postRoutes)
app.listen(3000)