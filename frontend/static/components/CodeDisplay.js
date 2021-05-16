app.component('code-display', {
    template:
        `<div id="code-field">
        <p
            v-for="(line, line_idx) in text"
            :style="{ marginLeft: getIndent(line_idx) + 'px' , opacity: getOpacity(line_idx)}">
            <span
                v-for="(character, char_idx) in line.content"    
                :class="getClassAt(line_idx, char_idx)"> 
                {{ character }}
            </span>
        </p>
        </div>`,
    data() {
        return {
            text1: [
                {line_idx: 0, content: "public static void main (String[] args) {", indent: 0},
                {line_idx: 1, content: "System.out.println(\"Hello World!\");", indent: 1},
                {line_idx: 3, content: "}", indent: 0}
            ],
            text2: [
                {line_idx: 0, content: "pubic static hair (String[] tanga) {", indent: 0},
                {line_idx: 1, content: "System.out.println(\"Sadi Gali!\");", indent: 1},
                {line_idx: 3, content: "}", indent: 0}
            ],
            text: "",
            INDENT_PX: 25,
            currentLine: 0,
            cursorPosition: 0,
            charsTyped: [],
            keysTyped: []
        }
    },
    methods: {
        getIndent(line_index) {
            return this.text[line_index].indent * this.INDENT_PX
        },
        getOpacity(line_index) {
            if (line_index <= this.currentLine) {
                return "100%"
            } else {
                return "10%"
            }
        },
        onkeydown(event) {
            let key = event.key
            if (key === "Backspace") {
                if (this.currentLine !== 0 || this.cursorPosition !== 0) {
                    this.reverseCursor()
                }
            } else if (key === "Enter") {
                if (this.cursorPosition >= this.currentLineLength - 1) {
                    this.newLine()
                } else {
                    this.charsTyped[this.currentLine].push(key)
                }
            } else if (key.length === 1) {
                this.charsTyped[this.currentLine].push(key)
                this.keysTyped.push(key)
                this.cursorPosition++
            }
        },
        getClassAt(line_idx, char_idx) {
            if (this.currentLine === line_idx && char_idx === this.charsTyped[line_idx].length) {
                return "highlighted"
            }
            if (char_idx >= this.charsTyped[line_idx].length) {
                return "plain"
            }
            if (this.text[line_idx].content.charAt(char_idx) === this.charsTyped[line_idx][char_idx]) {
                return "correct"
            } else {
                return "wrong"
            }
        },
        newLine() {
            this.currentLine++
            this.cursorPosition = 0
        },
        reverseCursor() {
            if (this.cursorPosition === 0 && this.currentLine !== 0) {
                this.currentLine--
                this.cursorPosition = this.currentLineLength
            } else {
                this.charsTyped[this.currentLine].pop()
                this.keysTyped.push("Backspace")
                this.cursorPosition--
            }
        },
    },
    computed: {
        currentLineLength() {
            return this.text[this.currentLine].content.length
        },
        currentLineText() {
            return this.text[this.currentLine].content
        },
    },
    created(){
        // get snippet from server
        this.text = this.text1;
        for (let l = 0; l < this.text.length; l++) {
            this.text[l].content = this.text[l].content += "↵"
        }

        document.onkeydown = this.onkeydown

        for (let l = 0; l < this.text.length; l++) {
            this.charsTyped[l] = []
        }
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

// function reverseCursor() {
//     if (cursor_pos === 0 && line_idx != 0) {
//         paras[line_idx].innerHTML = current_line
//         line_idx--
//         current_line = text_old[line_idx][0]
//         cursor_pos = current_line.length
//         current_history = history[line_idx]
//     } else {
//         current_history.pop()
//         cursor_pos--
//     }
//     updatePara()
//
// }

// function newLine() {
//     if (line_idx + 1 === text_old.length) {
//         get_new_snippet()
//         return
//     }
//     //TODO: kinda hacky (remove ↵)
//     return_next = false
//     updatePara()
//
//     cursor_pos = 0
//     line_idx++
//     current_line = text_old[line_idx][0]
//     current_history = history[line_idx]
//     updatePara()
// }


//for testing
// const get_new_snippet = async () => {
//     text_old = randomChoice(texts)
//     paras = {}
//     line_idx = 0
//     current_line = text_old[line_idx][0]
//     cursor_pos = 0
//     history = []
//     for (i = 0; i < text_old.length; i++) {
//         history[i] = []
//     }
//     current_history = history[line_idx]
//     displaySnippet()
// }
//
// function randomChoice(arr) {
//     return arr[Math.floor(Math.random() * arr.length)];
// }

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

