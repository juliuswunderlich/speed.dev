
//const text = document.getElementById("code").split(" ")
let text = ["public", "static", "void", "main"]
let token_idx = 0
let current_token = text[token_idx]
let cursor_pos = 0

document.addEventListener('keyup', function (event) {
    let key = event.key
    document.getElementById("key_label").innerHTML = key
    
    if(key === current_token.charAt(cursor_pos)) {
        forwardCursor()
        document.getElementById("forward").innerHTML = "forward: " + cursor_pos
        document.getElementById("current_token").innerHTML = current_token
    }

});

function forwardCursor() {
    cursor_pos++
    if (cursor_pos >= current_token.length) {
        token_idx++
        current_token = text[token_idx]
        cursor_pos = 0
        document.getElementById("textField").value = ""
    }
}

// POST: daraus den aufruf bauen, den wir brauchen sobald ein Code abgeschlossen ist 
const userAction = async () => {
    const response = await fetch('http://example.com/movies.json', {
      method: 'POST',
      body: myBody, // string or object
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const myJson = await response.json(); //extract JSON from the http response
    // do something with myJson
  }
