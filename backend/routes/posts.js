var express = require('express');
var router = express.Router();
var posts = require('../controllers/posts.js');

router.get('/', posts.getPosts);
router.get('/', posts.getSnippet);
//router.post('/', posts.createPost);
//router.patch('/:id', updatePost);
//router.delete('/:id', deletePost);
exports.router = router;
