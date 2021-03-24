//const text = document.getElementById("code").split(" ")
const text = [
    ["public static void main (String[] args) {", 0],
    ["System.out.println(\"Hello World!\");", 1],
    ["}", 0]
]
const INDENT_PX = 25
const HIGHLIGHT_COLOR = "#e79f0b"
const CORRECT_COLOR = "#00ff00"
const INCORRECT_COLOR = "#ff0000"

let paras = {}
let line_idx = 0
let current_line = text[line_idx][0]
let cursor_pos = 0

window.onload = function (event) {
    displaySnippet()
};

document.addEventListener('keydown', function (event) {
    let key = event.key

    if (key === "Enter") {
        if (cursor_pos >= current_line.length) {
            cursor_pos = 0
            line_idx++
            current_line = text[line_idx][0]
            highlightFirstCharacter()
            document.getElementById("textField").value = ""
        }
    }

    if (key === current_line.charAt(cursor_pos)) {
        forwardCursor(true)
        if (key === " ") {
            document.getElementById("textField").value = ""
        }
    } else {
        if (key === "Backspace") {
            reverseCursor()
        } else {
            forwardCursor(false)
        }


    }

});

function displaySnippet() {
    document.getElementById("code_field").innerHTML = ''
    for (l = 0; l < text.length; l++) {
        line = text[l]
        let para = document.createElement("p")
        paras[l] = para
        if (line[1] > 0) {
            indent = line[1] * INDENT_PX
            para.style.marginLeft = indent + "px"
        }
        let text_node = document.createTextNode(line[0])
        para.appendChild(text_node);
        document.getElementById("code_field").appendChild(para)
    }
    highlightFirstCharacter()
}

function forwardCursor(correct) {
    cursor_pos++
    if (correct) {
        color = CORRECT_COLOR
    } else {
        color = INCORRECT_COLOR
    }
    paras[line_idx].innerHTML = '<span style=\"color:' + color + ';\">'
        + text[line_idx][0].slice(0, cursor_pos)
        + '</span>'
        + '<span style=\"background-color:' + HIGHLIGHT_COLOR + ';\">'
        + text[line_idx][0].slice(cursor_pos, cursor_pos + 1)
        + '</span>'
        + text[line_idx][0].slice(cursor_pos + 1, current_line.length)
}

function reverseCursor() {


}

function highlightFirstCharacter() {
    paras[line_idx].innerHTML = '<span style=\"background-color:' + HIGHLIGHT_COLOR + ';\">'
        + text[line_idx][0].slice(0, cursor_pos + 1)
        + '</span>'
        + text[line_idx][0].slice(cursor_pos + 1, current_line.length)
}

//for testing
const get_new_snippet = async() => {
    paras = {}
    line_idx = 0
    current_line = text[line_idx][0]
    cursor_pos = 0
    displaySnippet()
}

// POST: daraus den aufruf bauen, den wir brauchen sobald ein Code abgeschlossen ist 
// const get_new_snippet = async () => {
//     const response = await fetch('localhost:3000/codeSnippet', {
//         method: 'POST',
//         body: myBody, // string or object
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     });
//     const myJson = await response.json(); //extract JSON from the http response
//     const snippet = JSON.parse(myJson)
//     text = snippet.code_array
//     document.getElementById("code").innerHTML = snippet.code
//
//     displaySnippet()
// }
