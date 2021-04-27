app.component('code-display', {
    template:
        `<div id="code-field">
        <p
        v-for="(line, line_idx) in text"
        :style="{ marginLeft: getIndent(line_idx) + 'px' }">
        <span
        v-for="(character, char_idx) in line.content"     
        :class="getClassAt(char_idx)">              
            {{ character }}
        </span>
        </p>
        </div>`,
    data() {
        return {
            text: [
                {line_idx: 0, content: "public static void main (String[] args) {", indent: 0},
                {line_idx: 1, content: "System.out.println(\"Hello World!\");", indent: 1},
                {line_idx: 3, content: "}", indent: 0},
            ],
            currentLine: 0,
            cursorPosition: 0,
            charsTyped: [],
            keysTyped: []
        }
    },
    methods: {
        getIndent(line_index) {
            return this.text[line_index].indent * INDENT_PX
        },
        onkeydown(event) {
            let key = event.key
            if (key === "Backspace") {
                this.charsTyped.pop()
                this.keysTyped.push(key)
                if (this.cursorPosition > this.currentLineLength) {
                    this.cursorPosition--
                }

            } else if (key.length === 1) {
                this.charsTyped.push(key)
                this.keysTyped.push(key)
                this.cursorPosition++
            }
            console.log(this.charsTyped)
        },
        getClassAt(index) {
            if (index === this.charsTyped.length) {
                return "highlighted"
            }
            if (index > this.charsTyped.length) {
                return "plain"
            }
            if (this.currentLineText.charAt(index) === this.charsTyped[index]) {
                return "correct"
            } else {
                return "wrong"
            }
        }
    },
    computed: {
        currentLineLength() {
            return this.text[this.currentLine].content.length
        },
        currentLineText() {
            return this.text[this.currentLine].content
        }
    },
    created() {
        document.onkeydown = this.onkeydown
    }
})


const text1 = [
    ["public static void main (String[] args) {", 0],
    ["System.out.println(\"Hello World!\");", 1],
    ["}", 0]
]
const text2 = [
    ["pubic static hair (String[] tanga) {", 0],
    ["System.out.println(\"Sadi Gali!\");", 1],
    ["}", 0]
]
const text3 = [
    ["private synchronized void whee (int count) {", 0],
    ["text = \"\";", 1],
    ["for (int i = 0; i < count; i++) {", 1],
    ["text += \"whee! \";", 2],
    ["System.out.println(text);", 2],
    ["}", 1],
    ["}", 0]
]
const text4 = [
    ["class Docker{", 0],
    ["private int levelOfShittiness;", 1],
    ["", 1],
    ["public Docker(){", 1],
    ["levelOfShittiness = 9000;", 2],
    ["}", 1],
    ["}", 0]

]

const texts = [text1, text2, text3, text4]
let text_old = text1

const INDENT_PX = 25
const HIGHLIGHT_COLOR = "#e79f0b"
const CORRECT_COLOR = "#00ff00"
const INCORRECT_COLOR = "#ff0000"

let paras = {}
let line_idx = 0
let current_line = text_old[line_idx][0]
let cursor_pos = 0
let history = {}
let return_next = false

window.onload = function (event) {
    get_new_snippet()
};

document.addEventListener('keydown', function (event) {
    return
    let key = event.key

    if (key === current_line.charAt(cursor_pos)) {
        forwardCursor(true)
    } else {
        if (key === "Backspace") {
            if (line_idx != 0 || cursor_pos != 0) {
                reverseCursor()
            }
        } else if (key === "Enter") {
            if (cursor_pos >= current_line.length) {
                newLine()
            } else {
                forwardCursor(false)
            }
        } else if (key.length === 1) {
            forwardCursor(false)
        }
    }

});


function displaySnippet() {
    document.getElementById("code_field").innerHTML = ''
    for (l = 0; l < text_old.length; l++) {
        line = text_old[l]
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
    updatePara()
}

function forwardCursor(correct) {
    if (cursor_pos + 1 >= current_line.length) {
        return_next = true
        updatePara()
        return
    }
    cursor_pos++
    if (correct) {
        current_history.push(true)
    } else {
        current_history.push(false)
    }
    updatePara()
}

function reverseCursor() {
    if (cursor_pos === 0 && line_idx != 0) {
        paras[line_idx].innerHTML = current_line
        line_idx--
        current_line = text_old[line_idx][0]
        cursor_pos = current_line.length
        current_history = history[line_idx]
    } else {
        current_history.pop()
        cursor_pos--
    }
    updatePara()

}

function newLine() {
    if (line_idx + 1 === text_old.length) {
        get_new_snippet()
        return
    }
    //TODO: kinda hacky (remove ↵)
    return_next = false
    updatePara()

    cursor_pos = 0
    line_idx++
    current_line = text_old[line_idx][0]
    current_history = history[line_idx]
    updatePara()
}

function updatePara() {
    innerHTML = ""
    for (i = 0; i < current_history.length; i++) {
        innerHTML +=
            '<span style=\"color:' + getColor(current_history[i]) + ';\">'
            + current_line.slice(i, i + 1)
            + '</span>'
    }

    if (cursor_pos < current_line.length) {
        innerHTML += '<span style=\"background-color:' + HIGHLIGHT_COLOR + ';\">'
            + current_line.slice(cursor_pos, cursor_pos + 1)
            + '</span>'
            + current_line.slice(cursor_pos + 1, current_line.length)
    }


    if (return_next) {
        innerHTML += '<span style=\"background-color:' + HIGHLIGHT_COLOR + ';\">' + "↵" + '</span>'
    }

    paras[line_idx].innerHTML = innerHTML
}

function getColor(correct) {
    if (correct) {
        return CORRECT_COLOR
    } else {
        return INCORRECT_COLOR
    }
}


//for testing
const get_new_snippet = async () => {
    text_old = randomChoice(texts)
    paras = {}
    line_idx = 0
    current_line = text_old[line_idx][0]
    cursor_pos = 0
    history = []
    for (i = 0; i < text_old.length; i++) {
        history[i] = []
    }
    current_history = history[line_idx]
    displaySnippet()
}

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
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

