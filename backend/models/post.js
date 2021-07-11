var mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    "title": String,
    "content": String,
    "author": String,
    "tags": [String],
}, { timestamps: true });

const postSnippetschema = new mongoose.Schema({
    ""
})

const Post = mongoose.model('post', postSchema);
exports.Post = Post;s