//const text = document.getElementById("code").split(" ")
const text = [
    ["public static void main (String[] args) {", 0],
    ["System.out.println(\"Hello World!\");", 1],
    ["}", 0]
]
const indent_px = 25
let paras = {}

let line_idx = 0
let current_line = text[line_idx][0]
let cursor_pos = 0

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

document.addEventListener('keydown', function (event) {
    let key = event.key

    if (key === "Enter") {
        if (cursor_pos >= current_line.length) {
            cursor_pos = 0
            line_idx++
            current_line = text[line_idx][0]
            document.getElementById("textField").value = ""
        }
    }

    if (key === current_line.charAt(cursor_pos)) {
        forwardCursor()
        if (key === " ") {
            document.getElementById("textField").value = ""
        }
    } else {
        // TODO: Tippfehler

    }

});

function forwardCursor() {
    cursor_pos++
    paras[line_idx].innerHTML = '<span style=\"background-color:#00ff00;\">' + text[line_idx][0].slice(0, cursor_pos) + '</span>' + text[line_idx][0].slice(cursor_pos, current_line.length)
}

// POST: daraus den aufruf bauen, den wir brauchen sobald ein Code abgeschlossen ist 
const get_new_snippet = async () => {
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
