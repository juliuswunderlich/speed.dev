// const text = [
//     ["public static void main (String[] args) {", 0],
//     ["System.out.println(\"Hello World!\");", 1],
//     ["}", 0]
// ]
const text = [
    ["public static", 0],
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

let history = {}

window.onload = function (event) {
    get_new_snippet()
};

document.addEventListener('keydown', function (event) {
    let key = event.key

    if (key === "Enter") {
        if (cursor_pos >= current_line.length) {
            cursor_pos = 0
            line_idx++
            current_line = text[line_idx][0]
            current_history = history[line_idx]
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
            if (line_idx != 0 || cursor_pos != 0) {
                reverseCursor()
            }
        } else if (key.length === 1) {
            forwardCursor(false)
        }
    }

});

function updateText() {
    innerHTML = ""
    for (i = 0; i < current_history.length; i++) {
        innerHTML +=
            '<span style=\"color:' + getColor(current_history[i]) + ';\">'
            + current_line.slice(i, i + 1)
            + '</span>'
    }

    innerHTML += '<span style=\"background-color:' + HIGHLIGHT_COLOR + ';\">'
        + current_line.slice(cursor_pos, cursor_pos + 1)
        + '</span>'
        + current_line.slice(cursor_pos + 1, current_line.length)

    paras[line_idx].innerHTML = innerHTML

}

function getColor(correct) {
    if (correct) {
        return CORRECT_COLOR
    } else {
        return INCORRECT_COLOR
    }
}

function displaySnippet() {
    document.getElementById("textField").value = ""
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
        current_history.push(true)
    } else {
        current_history.push(false)
    }
    updateText()
}

function reverseCursor() {
    if (cursor_pos === 0 && line_idx != 0) {
        paras[line_idx].innerHTML = current_line
        line_idx--
        current_line = text[line_idx][0]
        cursor_pos = current_line.length
        current_history = history[line_idx]
    } else {
        current_history.pop()
        cursor_pos--
    }
    updateText()

}

function highlightFirstCharacter() {
    paras[line_idx].innerHTML = '<span style=\"background-color:' + HIGHLIGHT_COLOR + ';\">'
        + text[line_idx][0].slice(0, cursor_pos + 1)
        + '</span>'
        + text[line_idx][0].slice(cursor_pos + 1, current_line.length)
}

//for testing
const get_new_snippet = async () => {
    paras = {}
    line_idx = 0
    current_line = text[line_idx][0]
    cursor_pos = 0
    history = []
    for(i = 0; i < text.length; i++) {
        history[i] = []
    }
    current_history = history[line_idx]
    displaySnippet()
}

// dude prolly sth with this
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
