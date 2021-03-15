//const text = document.getElementById("code").split(" ")
const text = [
    ["public static void main (String[] args) {", 0],
    ["System.out.println(\"Hello World!\");", 1],
    ["}", 0]
]
const indent_px = 25
let paras = {}

let line_idx = 0
let token_idx = 0
let current_line = text[line_idx][0]
let cursor_pos = 0
let whitespace_next = false

window.onload = function (event) {
    for (l = 0; l < text.length; l++) {
        line = text[l]
        let para = document.createElement("p")
        paras[l] = para
        if (line[1] > 0) {
            indent = line[1] * indent_px
            para.style.marginLeft = indent + "px"
        }
        let text_node = document.createTextNode(line[0])
        para.appendChild(text_node);
        document.getElementById("code_field").appendChild(para)
    }
};

document.addEventListener('keyup', function (event) {
    let key = event.key
    document.getElementById("key_label").innerHTML = key

    if (key === current_line.charAt(cursor_pos)) {
        forwardCursor()
        document.getElementById("forward").innerHTML = "forward: " + cursor_pos
        document.getElementById("current_token").innerHTML = current_token
        if (key === " ") {
            document.getElementById("textField").value = ""
        }
    }

});

function forwardCursor() {
    cursor_pos++
    paras[line_idx].innerHTML = '<span style=\"background-color:#00ff00;\">' + text[line_idx][0].slice(0, cursor_pos) + '</span>' + text[line_idx][0].slice(cursor_pos, current_line.length)

}

// POST: daraus den aufruf bauen, den wir brauchen sobald ein Code abgeschlossen ist 
const get_new_snippet = async () => {
    document.getElementById("code").innerHTML = "loading new snippet..."
    const response = await fetch('localhost:3000/codeSnippet', {
        method: 'POST',
        body: myBody, // string or object
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const myJson = await response.json(); //extract JSON from the http response
    const snippet = JSON.parse(myJson)
    text = snippet.code_array
    document.getElementById("code").innerHTML = snippet.code


}
