<template>
  <div id="wrapper">
    <div id="line-numbers">
      <p v-for="line_number in visibleLines" :key="line_number.id">
        {{ line_number + 1 }}
      </p>
    </div>
    <div id="code-field">
      <p
        v-for="(line, line_idx) in text"
        :key="line.id"
        :style="{
          marginLeft: getIndent(line_idx) + 'px',
          opacity: getOpacity(line_idx),
        }"
      >
        <span
          v-for="(character, char_idx) in line.content"
          :key="character.id"
          :class="getClassAt(line_idx, char_idx)"
        >
          {{ getCharacterAt(line_idx, char_idx) }}
        </span>
      </p>
    </div>
    <div id="info">
      <img
        src="@/assets/buttonInfo.svg"
        alt="info"
        class="icon"
        v-on:click="showInfo"
      />
    </div>
    <div id="retry">
      <img
        src="@/assets/buttonRetry.svg"
        alt="retry"
        class="icon"
        v-on:click="resetSnippet"
      />
    </div>
    <div id="next">
      <img
        src="@/assets/buttonNext.svg"
        alt="next"
        class="icon"
        v-on:click="displayNewSnippet"
      />
    </div>
    <div id="timer">
      {{ formattedTime }}
    </div>
  </div>
</template>


<script>
export default {
  name: "CodeDisplay",
  data() {
    return {
      text1: [
        {
          line_idx: 0,
          content: "public static void main (String[] args) {",
          indent: 0,
        },
        {
          line_idx: 1,
          content: 'System.out.println("Hello World!");',
          indent: 1,
        },
        { line_idx: 2, content: "}", indent: 0 },
      ],
      text2: [
        {
          line_idx: 0,
          content: "pubic static hair (String[] tanga) {",
          indent: 0,
        },
        {
          line_idx: 1,
          content: 'System.out.println("Sadi Gali!");',
          indent: 1,
        },
        { line_idx: 2, content: "}", indent: 0 },
      ],
      text3: [
        { line_idx: 0, content: "void bubbleSort(int arr[]) {", indent: 0 },
        { line_idx: 1, content: "int n = arr.length;", indent: 1 },
        { line_idx: 2, content: "for (int i = 0; i < n-1; i++) {", indent: 1 },
        {
          line_idx: 3,
          content: "for (int j = 0; j < n-i-1; j++) {",
          indent: 2,
        },
        { line_idx: 4, content: "if (arr[j] > arr[j+1]) {", indent: 3 },
        { line_idx: 5, content: "int temp = arr[j];", indent: 4 },
        { line_idx: 6, content: "arr[j] = arr[j+1];", indent: 4 },
        { line_idx: 7, content: "arr[j+1] = temp;", indent: 4 },
        { line_idx: 8, content: "}", indent: 3 },
        { line_idx: 9, content: "}", indent: 2 },
        { line_idx: 10, content: "}", indent: 1 },
        { line_idx: 10, content: "}", indent: 0 },
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
    };
  },
  methods: {
    getIndent(line_index) {
      return this.text[line_index].indent * this.INDENT_PX;
    },
    getOpacity(line_index) {
      if (this.endReached) {
        return "40%"
      }
      if (line_index <= this.currentLine) {
        return "100%";
      } else {
        return "10%";
      }
    },
    onkeydown(event) {
      let key = event.key;
      if (key === "Tab") {
        event.preventDefault()
        if (this.timerRunning) {
          this.resetSnippet();
        } else {
          this.displayNewSnippet();
        }
        return;
      }
      if (this.endReached) {
        return;
      }      
      if (key === "Backspace") {
        if (this.currentLine !== 0 || this.cursorPosition !== 0) {
          this.reverseCursor();
        }
      } else if (key === "Enter") {
        if (!this.timerRunning) {
          this.startTimer();
        }
        this.charsTyped[this.currentLine].push("↵");
        if (this.cursorPosition >= this.currentLineLength - 1) {
          this.newLine();
        } else {
          this.cursorPosition++;
        }
      } else if (key.length === 1) {
        if (!this.timerRunning) {
          this.startTimer();
        }
        this.charsTyped[this.currentLine].push(key);
        if (this.cursorPosition >= this.currentLineLength - 1) {
          this.newLine();
        } else {
          this.cursorPosition++;
        }
      }
    },
    //return the style class given a character at a specific position
    getClassAt(line_idx, char_idx) {
      //character after cursor
      if (
        line_idx > this.currentLine ||
        (line_idx === this.currentLine && char_idx > this.cursorPosition)
      ) {
        //enter symbol
        if (char_idx === this.text[line_idx].content.length - 1) {
          return "invisible";
        }
        return "plain";
      }
      //character at cursor
      if (
        this.currentLine === line_idx &&
        char_idx === this.charsTyped[line_idx].length
      ) {
        return "highlighted";
      }
      //character before cursor
      if (
        this.text[line_idx].content.charAt(char_idx) ===
        this.charsTyped[line_idx][char_idx]
      ) {
        return "correct";
      } else {
        return "wrong";
      }
    },
    //if a space is typed incorrectly, an underscore is displayed instead
    getCharacterAt(line_idx, char_idx) {
      let char = this.text[line_idx].content.charAt(char_idx);
      if (char === " " && this.getClassAt(line_idx, char_idx) === "wrong") {
        return "_";
      } else {
        return char;
      }
    },
    newLine() {
      if (this.currentLine === this.text.length - 1) {
        this.stopTimer();
        this.endReached = true;
        // this.displayNewSnippet()
      } else {
        this.currentLine++;
        this.cursorPosition = 0;
      }
    },
    reverseCursor() {
      if (this.cursorPosition === 0 && this.currentLine !== 0) {
        this.currentLine--;
        this.charsTyped[this.currentLine].pop();
        this.cursorPosition = this.currentLineLength - 1;
      } else {
        this.charsTyped[this.currentLine].pop();
        this.cursorPosition--;
      }
    },
    displayNewSnippet() {
      // get snippet from server
      this.text = this.randomChoice(this.texts);

      // add return symbol after each line
      //TODO: put back in once snippet is pulled from server
      // for (let l = 0; l < this.text.length; l++) {
      //     this.text[l].content = this.text[l].content += "↵"
      // }

      this.resetSnippet();
    },
    resetSnippet() {
      //initialize/reset key history for each line
      for (let l = 0; l < this.text.length; l++) {
        this.charsTyped[l] = [];
      }

      this.currentLine = 0;
      this.cursorPosition = 0;
      this.endReached = false;
      this.resetTimer();
    },
    showInfo() {
      //TODO
      alert("Info for this snippet...");
    },
    randomChoice(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    },
    startTimer() {
      this.timerRunning = true;
      this.startTime = Date.now();

      let updateTimer = setInterval(() => {
        if (!this.timerRunning) {
          clearInterval(updateTimer);
        } else {
          this.msRunning = Date.now() - this.startTime;
        }
      }, 100);
    },
    stopTimer() {
      this.timerRunning = false;
      this.endTime = Date.now();
    },
    resetTimer() {
      this.timerRunning = false;
      this.msRunning = 0;
    },
  },
  computed: {
    currentLineLength() {
      return this.text[this.currentLine].content.length;
    },
    currentLineText() {
      return this.text[this.currentLine].content;
    },
    visibleLines() {
      let list = [];
      for (let i = 0; i <= this.currentLine; i++) {
        list.push(i);
      }
      return list;
    },
    formattedTime() {
      let secondsTotal = Math.floor(this.msRunning / 1000);
      let minutes = Math.floor(secondsTotal / 60);
      let seconds = secondsTotal % 60;
      return minutes + ":" + seconds.toString().padStart(2, "0");
    },
  },
  created() {
    this.texts = [this.text1, this.text2, this.text3];

    //TODO: remove once snippets get pulled from server
    // add return symbol after each line
    for (let t = 0; t < this.texts.length; t++) {
      for (let l = 0; l < this.texts[t].length; l++) {
        this.texts[t][l].content = this.texts[t][l].content += "↵";
      }
    }

    //add keyListener
    document.onkeydown = this.onkeydown;

    this.displayNewSnippet();
  },
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#wrapper {
  font-family: "Hack", monospace;
  font-size: 25px;
  line-height: 30%;
  color: white;

  display: grid;
  grid-template-columns: 100px 50px 1fr 50px 50px;
  grid-template-rows: 1fr 50px;
  row-gap: 100px;

  position: absolute;
  top: 45%;
  left: 50%;
  /* center snippet without line numbers -> deduct half the width of #line-numbers*/
  transform: translate(calc(-50% - 50px), -50%);
}

#line-numbers {
  text-align: right;
  opacity: 10%;
  width: 30px;
  padding-right: 70px;
}
#code-field {
  grid-area: 1/ 2/ 2/ 6;
}

#info {
  grid-area: 2/ 2/ 3/ 3;
  align-self: end;
}
#retry {
  grid-area: 2/ 4/ 3/ 5;
  justify-self: right;
  align-self: end;
}
#next {
  grid-area: 2/ 5/ 3/ 6;
  justify-self: right;
  align-self: end;
}
#timer {
  grid-area: 2/ 3/ 3/ 4;
  justify-self: center;
  align-self: end;
  line-height: 100%;
}

.icon {
  width: 25px;
  height: 25px;
  opacity: 50%;
}
.icon:hover {
  opacity: 100%;
  cursor: pointer;
}
.icon:active {
  transform: scale(1.1);
}

.correct {
  /*background-color: rgba(0, 255, 0, .1);*/
  color: white;
}
.wrong {
  /*background-color: rgba(255, 0, 0, .1);*/
  color: red;
}
.plain {
  color: rgba(255, 255, 255, 0.3);
}
.highlighted {
  background-color: rgba(196, 196, 196, 0.5);
}
.invisible {
  opacity: 0;
}
</style>
