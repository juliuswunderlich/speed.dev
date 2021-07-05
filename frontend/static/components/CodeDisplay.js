app.component('code-display', {
    template:
        `<div id="wrapper">
            <div id="line-numbers">
                <p
                    v-for="line_number in visibleLines">
                    {{ line_number + 1 }}
                </p>
            </div>
            <div id="code-field">
                <p
                    v-for="(line, line_idx) in text"
                    :style="{ marginLeft: getIndent(line_idx) + 'px', opacity: getOpacity(line_idx)}">
                    <span
                        v-for="(character, char_idx) in line.content"    
                        :class="getClassAt(line_idx, char_idx)"> 
                        {{ getCharacterAt(line_idx, char_idx) }}
                    </span>
                </p>
            </div>
            <div id="info">
                <img src="frontend/assets/buttonInfo.svg" alt="info" class="icon" v-on:click="showInfo">
            </div>
            <div id="retry">
                <img src="frontend/assets/buttonRetry.svg" alt="retry" class="icon" v-on:click="resetSnippet">
            </div>
            <div id="next">
                <img src="frontend/assets/buttonNext.svg" alt="next" class="icon" v-on:click="displayNewSnippet">
            </div>
            <div id="timer">
                {{ formattedTime }}
            </div>       
        </div>`,
    data() {
        return {
            text1: [
                {line_idx: 0, content: "public static void main (String[] args) {", indent: 0},
                {line_idx: 1, content: "System.out.println(\"Hello World!\");", indent: 1},
                {line_idx: 2, content: "}", indent: 0}
            ],
            text2: [
                {line_idx: 0, content: "pubic static hair (String[] tanga) {", indent: 0},
                {line_idx: 1, content: "System.out.println(\"Sadi Gali!\");", indent: 1},
                {line_idx: 2, content: "}", indent: 0}
            ],
            text3: [
                {line_idx: 0, content: "void bubbleSort(int arr[]) {", indent: 0},
                {line_idx: 1, content: "int n = arr.length;", indent: 1},
                {line_idx: 2, content: "for (int i = 0; i < n-1; i++) {", indent: 1},
                {line_idx: 3, content: "for (int j = 0; j < n-i-1; j++) {", indent: 2},
                {line_idx: 4, content: "if (arr[j] > arr[j+1]) {", indent: 3},
                {line_idx: 5, content: "int temp = arr[j];", indent: 4},
                {line_idx: 6, content: "arr[j] = arr[j+1];", indent: 4},
                {line_idx: 7, content: "arr[j+1] = temp;", indent: 4},
                {line_idx: 8, content: "}", indent: 3},
                {line_idx: 9, content: "}", indent: 2},
                {line_idx: 10, content: "}", indent: 1},
                {line_idx: 10, content: "}", indent: 0}
            ],
            texts: [],
            text: null,
            INDENT_PX: 40,

            //typing logic
            currentLine: 0,
            cursorPosition: 0,
            charsTyped: [],
            endReached: false,

            //timer
            timerRunning: false,
            msRunning: 0,
            startTime: 0,
            endTime: 0,
            //(for stats) keysTyped: []
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
            if (this.endReached) {
                return
            }
            let key = event.key
            if (key === "Backspace") {
                if (this.currentLine !== 0 || this.cursorPosition !== 0) {
                    this.reverseCursor()
                }
            } else if (key === "Enter") {
                if(!this.timerRunning) {
                    this.startTimer()
                }
                this.charsTyped[this.currentLine].push("↵")
                if (this.cursorPosition >= this.currentLineLength - 1) {
                    this.newLine()
                } else {
                    this.cursorPosition++
                }
            } else if (key.length === 1) {
                if(!this.timerRunning) {
                    this.startTimer()
                }
                this.charsTyped[this.currentLine].push(key)
                if (this.cursorPosition >= this.currentLineLength - 1) {
                    this.newLine()
                } else {
                    this.cursorPosition++
                }
            }
        },
        //return the style class given a character at a specific position
        getClassAt(line_idx, char_idx) {
            //character after cursor
            if (line_idx > this.currentLine || (line_idx === this.currentLine && char_idx > this.cursorPosition)) {
                //enter symbol
                if (char_idx === this.text[line_idx].content.length - 1) {
                    return "invisible"
                }
                return "plain"
            }
            //character at cursor
            if (this.currentLine === line_idx && char_idx === this.charsTyped[line_idx].length) {
                return "highlighted"
            }
            //character before cursor
            if (this.text[line_idx].content.charAt(char_idx) === this.charsTyped[line_idx][char_idx]) {
                return "correct"
            } else {
                return "wrong"
            }

        },
        //if a space is typed incorrectly, an underscore is displayed instead
        getCharacterAt(line_idx, char_idx) {
            let char = this.text[line_idx].content.charAt(char_idx)
            if (char === " " && this.getClassAt(line_idx, char_idx) === "wrong") {
                return "_"
            } else {
                return char
            }
        },
        newLine() {
            if (this.currentLine === this.text.length - 1) {
                this.stopTimer()
                this.endReached = true
                // this.displayNewSnippet()
            } else {
                this.currentLine++
                this.cursorPosition = 0
            }
        },
        reverseCursor() {
            if (this.cursorPosition === 0 && this.currentLine !== 0) {
                this.currentLine--
                this.charsTyped[this.currentLine].pop()
                this.cursorPosition = this.currentLineLength - 1
            } else {
                this.charsTyped[this.currentLine].pop()
                this.cursorPosition--
            }
        },
        displayNewSnippet() {
            // get snippet from server
            this.text = this.randomChoice(this.texts)

            // add return symbol after each line
            //TODO: put back in once snippet is pulled from server
            // for (let l = 0; l < this.text.length; l++) {
            //     this.text[l].content = this.text[l].content += "↵"
            // }

            this.resetSnippet()
        },
        resetSnippet() {
            //initialize/reset key history for each line
            for (let l = 0; l < this.text.length; l++) {
                this.charsTyped[l] = []
            }

            this.currentLine = 0
            this.cursorPosition = 0
            this.endReached = false
            this.resetTimer()
        },
        showInfo() {
            //TODO
            alert ("Info for this snippet...")
        },
        randomChoice(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        },
        startTimer() {
            this.timerRunning = true
            this.startTime = Date.now()

            let updateTimer = setInterval(() => {
                if (!this.timerRunning) {
                    clearInterval(updateTimer)
                } else {
                    this.msRunning = Date.now() - this.startTime
                }
            }, 100)
        },
        stopTimer() {
            this.timerRunning = false
            this.endTime = Date.now()
        },
        resetTimer() {
            this.timerRunning = false
            this.msRunning = 0


        }
    },
    computed: {
        currentLineLength() {
            return this.text[this.currentLine].content.length
        },
        currentLineText() {
            return this.text[this.currentLine].content
        },
        visibleLines() {
            let list = [];
            for (let i = 0; i <= this.currentLine; i++) {
                list.push(i);
            }
            return list
        },
        formattedTime() {
            let secondsTotal = Math.floor(this.msRunning / 1000)
            let minutes = Math.floor(secondsTotal / 60)
            let seconds = secondsTotal % 60
            return minutes + ":" + seconds.toString().padStart(2, '0')
        }

    },
    created() {
        this.texts = [this.text1, this.text2, this.text3]

        //TODO: remove once snippets get pulled from server
        // add return symbol after each line
        for (let t = 0; t < this.texts.length; t++) {
            for (let l = 0; l < this.texts[t].length; l++) {
                this.texts[t][l].content = this.texts[t][l].content += "↵"
            }
        }

        //add keyListener
        document.onkeydown = this.onkeydown

        this.displayNewSnippet()
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

