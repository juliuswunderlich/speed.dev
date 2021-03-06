const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// where we land initially
app.get('/',(req,res) => {
    res.status(200).send('Hello World!\n');
});

app.get("/codeSnippet", (req, res, next) => {
    res.json(
        {
            "id":"00001",
            "lang":"java",
            "code": ["class", " ", "MyClass", " ", "{","}"]
        }
        )
});