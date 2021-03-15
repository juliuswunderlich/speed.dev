const fs = require('fs')
const readline = require('readline');


const codes = []


fs.readdir("./Codes/files", function(err, filenames) {
  let counter = 0
  if (err) {
    console.log(err)
    return;
  }
  filenames.forEach(function(filename) {
    let split = (filename.split('.'))
    let fe = split[split.length - 1]
    ++counter
    // create object
    let code = {
      id : counter,
      fileEnding : fe,
      title : "filename",
      lines : []
    }

    // create a interface to write to 
    const readInterface = readline.createInterface({
      input: fs.createReadStream('./Codes/files/' + filename),
      //output: process.stdout,
      console: false
    });
    // send line wise
    // count prepended white spaces and count them
    readInterface.on('line', l => {
      let num= l.length - l.trimLeft().length // how many whitespaces were there
      let line = {
        leadingWhitespaceNum : num,
        line : l
      }
      codes[counter -1] = code.lines.push(line)
    })
    console.log(codes)
  });

});


