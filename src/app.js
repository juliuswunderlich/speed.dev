const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Server running at port 3000`);
});

// where we land initially
app.get('/',(req,res) => {
    res.status(200).send('Hello World!\n');
    //pubGists();

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


// load all public gists
//pubGists = axios.get('https://jsonplaceholder.typicode.com/todos/1')
pubGists = axios.get('https://api.github.com/gists/public')
  .then(response => {
    console.log("we got a response");
    // public gist registry just contains url to user gists (no code)
    //for(var gist of response.data){
        axios.get(response.data[0].url).then(response => {
            // check if useful file types in user gist
            for (file of response.data.files) {
                console.log(file.type);
                // todo check what filetypes there are
            }
        })
        .catch(error => {
            console.log(error);
        })
    //}

  })
  .catch(error => {
    console.log(error);
  });

// splits a huge code snippet on whitespaces and line breaks
function splitCode(code) {

}