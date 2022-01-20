<template>
  <div id="wrapper">
    <!-- <img id="logo" src="@/assets/java.svg" alt="java logo" /> -->
    <div id="line-numbers">
      <span
        class="line"
        v-for="line_number in visibleLines"
        :key="line_number.id"
      >
        {{ line_number + 1 }}
      </span>
    </div>
    <div id="code-field" :style="{ overflowY: codeFieldScroll }">
      <span
        id="code-line"
        class="line"
        v-for="(line, line_idx) in text.lines"
        :key="line.id"
        :style="{
          paddingLeft: getIndent(line_idx) + 'em',
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
      </span>
    </div>
    <div id="info">
      <img
        src="@/assets/buttonInfo.svg"
        alt="info"
        class="icon"
        v-on:click="showInfo"
      />
    </div>
    <div id="retry" title="Restart (TAB)">
      <img
        src="@/assets/buttonRetry.svg"
        alt="retry"
        class="icon"
        v-on:click="resetSnippet"
      />
    </div>
    <div id="next" title="Next (TAB)">
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
    <div id="stats" v-if="displayStats">
      <span>{{ Math.round(netWpm) }}wpm</span>
      <span>{{ Math.round(rawWpm) }}raw</span>
      <span>{{ Math.round(accuracy) }}%</span>
      <span>{{ secondsTotal.toFixed(2) }}s</span>
    </div>
  </div>
</template>


<script>
export default {
  name: "CodeDisplay",
  data() {
    return {
      fs: null,
      texts: [],
      text: "",
      INDENT_EM: 1.6,
      START_SCROLL_AFTER_LINE: 2,
      scrolledDown: 0,

      //typing logic
      currentLine: 0,
      cursorPosition: 0,
      charsTyped: [],
      preventDefaultKeys: ["Tab", "/", "'", " "],

      //timer
      timerRunning: false,
      msRunning: 0,
      startTime: 0,
      endTime: 0,

      //stats
      keysTyped: [],
      displayStats: false,
    };
  },
  methods: {
    getIndent(line_index) {
      return this.text.lines[line_index].indent * this.INDENT_EM;
    },
    getOpacity(line_index) {
      if (this.displayStats) {
        return "15%";
      }
      if (line_index <= this.currentLine) {
        return "100%";
      } else if (line_index == this.currentLine + 1) {
        return "50%";
      } else {
        return "10%";
      }
    },
    onkeydown(event) {
      let key = event.key;
      if (this.preventDefaultKeys.includes(key)) {
        event.preventDefault();
      }
      if (key === "Tab") {
        if (this.timerRunning) {
          this.resetSnippet();
        } else {
          this.displayNewSnippet();
        }
        return;
      }
      if (this.displayStats) {
        return;
      }
      if (key === "Backspace") {
        if (this.currentLine !== 0 || this.cursorPosition !== 0) {
          this.reverseCursor();
        }
      } else if (key === "Enter" || key.length === 1) {
        if (!this.timerRunning) {
          this.startTimer();
        }
        this.keysTyped[this.currentLine].push(key === "Enter" ? "↵" : key);
        this.charsTyped[this.currentLine].push(key === "Enter" ? "↵" : key);
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
        if (char_idx === this.getLine(line_idx).length - 1) {
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
        this.getLine(line_idx).charAt(char_idx) ===
        this.charsTyped[line_idx][char_idx]
      ) {
        return "correct";
      } else {
        return "wrong";
      }
    },
    //if a space is typed incorrectly, an underscore is displayed instead
    getCharacterAt(line_idx, char_idx) {
      let char = this.getLine(line_idx).charAt(char_idx);
      if (char === " " && this.getClassAt(line_idx, char_idx) === "wrong") {
        return "_";
      } else {
        return char;
      }
    },
    newLine() {
      if (this.currentLine === this.numberOfLines - 1) {
        this.snippetFinished();
        // this.displayNewSnippet()
      } else {
        this.currentLine++;
        this.cursorPosition = 0;
        this.checkScrollForward();
      }
    },
    isLineInCodeField(el) {
      var rect = el.getBoundingClientRect();
      var parentRect = el.parentNode.getBoundingClientRect();
      return rect.top >= parentRect.top && rect.bottom <= parentRect.bottom;
    },
    checkScrollForward() {
      let lastElem = this.lineElements[this.lineElements.length - 1];

      if (!this.isLineInCodeField(lastElem)) {
        if (this.currentLine > this.START_SCROLL_AFTER_LINE) {
          this.scrolledDown++;
          let elemToScrollTo = this.lineElements[this.scrolledDown];
          elemToScrollTo.scrollIntoView({ behavior: "smooth" });
        }
      }
    },
    reverseCursor() {
      if (this.cursorPosition === 0 && this.currentLine !== 0) {
        this.currentLine--;
        this.charsTyped[this.currentLine].pop();
        this.cursorPosition = this.currentLineLength - 1;
        this.checkScrollBackward();
      } else {
        this.charsTyped[this.currentLine].pop();
        this.cursorPosition--;
      }
    },
    checkScrollBackward() {
      if (this.scrolledDown == 0) {
        return;
      }
      if (
        this.currentLine <=
        this.scrolledDown + this.START_SCROLL_AFTER_LINE
      ) {
        this.scrolledDown--;
        let elemToScrollTo = this.lineElements[this.scrolledDown];
        elemToScrollTo.scrollIntoView({ behavior: "smooth" });
      }
    },
    snippetFinished() {
      this.stopTimer();
      this.displayStats = true
      this.$router.push('results')
      // this.$root.$emit('testResults', )
      //TODO: repalce by state management

      const results = {
        snippetId: this.text.id,
        netWpm: Math.round(this.netWpm * 100) / 100,
        rawWpm: Math.round(this.rawWpm * 100) / 100,
        accuracy: Math.round(this.accuracy * 100) / 100,
        secondsTotal: Math.round(this.secondsTotal * 100) / 100,
      }

      this.$root.$emit('snippetFinished', {results: results, keysTyped: this.keysTyped, charsTyped: this.charsTyped})

      const userId = "niklasLuehrUserId"; //TODO!
      this.fs
        .collection("tests")
        .add({
          userId: userId,
          timeFinished: this.$firebase.firestore.FieldValue.serverTimestamp(),
          ...results
        })
        .then(() => {
          console.log("Test results saved.");
        })
        .catch((error) => {
          console.error("Error writing test: ", error);
        });
    },
    displayNewSnippet() {
      // TODO: get new snippets from server once all buffered snippets have been shown
      this.text = this.randomChoice(this.texts);
      this.resetSnippet();
    },
    resetSnippet() {
      //initialize/reset key history for each line
      this.charsTyped.length = 0;
      this.keysTyped.length = 0;
      for (let l = 0; l < this.numberOfLines; l++) {
        this.charsTyped[l] = [];
        this.keysTyped[l] = [];
      }

      this.currentLine = 0;
      this.cursorPosition = 0;
      this.scrolledDown = 0;
      document.querySelector("#code-field").scrollTo(0, 0);
      this.resetTimer();
      this.displayStats = false;
    },
    showInfo() {
      //TODO
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
    getLine(line_idx) {
      return this.text.lines[line_idx].content;
    },
  },
  computed: {
    currentLineLength() {
      return this.currentLineText.length;
    },
    currentLineText() {
      return this.getLine(this.currentLine);
    },
    numberOfLines() {
      return this.text.lines.length;
    },
    currentLogo() {
      //TODO
      return "@/assets/" + this.text.lang + ".svg";
    },
    visibleLines() {
      let list = [];
      for (let i = 0; i <= this.currentLine; i++) {
        list.push(i);
      }
      return list;
    },
    lineElements() {
      return document.querySelector("#code-field").children;
    },
    formattedTime() {
      let minutes = Math.floor(this.secondsTotal / 60);
      let seconds = Math.floor(this.secondsTotal % 60);
      return minutes + ":" + seconds.toString().padStart(2, "0");
    },
    codeFieldScroll() {
      return this.displayStats ? "scroll" : "hidden";
    },
    secondsTotal() {
      return this.msRunning / 1000;
    },
    numUncorrectedErrors() {
      let wrongChars = 0;
      for (let l = 0; l < this.numberOfLines; l++) {
        for (let c = 0; c < this.getLine(l).length; c++) {
          if (this.charsTyped[l][c] != this.getLine(l).charAt(c)) {
            wrongChars++;
          }
        }
      }
      return wrongChars;
    },
    minutesTotal() {
      return this.secondsTotal / 60;
    },
    numKeysTyped() {
      let lengthTotal = 0;
      for (let l = 0; l < this.numberOfLines; l++) {
        lengthTotal += this.keysTyped[l].length;
      }
      return lengthTotal;
    },
    numCharsTyped() {
      let lengthTotal = 0;
      for (let l = 0; l < this.numberOfLines; l++) {
        lengthTotal += this.charsTyped[l].length;
      }
      return lengthTotal;
    },
    rawWpm() {
      return this.numKeysTyped / 5 / this.minutesTotal;
    },
    netWpm() {
      return Math.max(0, this.rawWpm - this.numUncorrectedErrors / this.minutesTotal);
    },
    accuracy() {
      let correctedErrors = this.numKeysTyped - this.numCharsTyped;
      let totalErrors = correctedErrors + this.numUncorrectedErrors;
      return 100 - (totalErrors / this.numKeysTyped) * 100;
    },
  },
  created() {
    //add keyListener
    document.onkeydown = this.onkeydown;
    this.scrolledDown = 0;

    // load all snippets for now
    //TODO: this happens every time this component is loaded
    // -> put in App.vue (?)
    this.fs = this.$firebase.firestore();
    this.fs
      .collection("snippets")
      .get()
      .then((querySnapshot) => {
        this.texts = querySnapshot.docs.map((doc) => doc.data());

        // add newline symbols
        for (let t = 0; t < this.texts.length; t++) {
          for (let l = 0; l < this.texts[t].lines.length; l++) {
            this.texts[t].lines[l].content = this.texts[t].lines[l].content +=
              "↵";
          }
        }

        this.displayNewSnippet();
      });
  },
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
* {
  box-sizing: border-box;
}
#wrapper {
  font-family: "Hack", monospace;
  font-size: 1.1rem;
  color: white;

  display: grid;
  grid-template-columns: 50px 50px auto 50px 50px;
  grid-template-rows: auto 30px;
  row-gap: 1.5em;

  position: absolute;
  top: 50%;
  left: 50%;
  /* center snippet without line numbers -> deduct half the width of #line-numbers (50px) */
  transform: translate(calc(-50% - 25px), -50%);

  @media only screen and (max-width: 1500px) {
    font-size: 1rem;
  }
}
#logo {
  max-width: 40px;
  height: 40px;
  grid-area: 1/ 2/ 2/ 6;
  justify-self: center;
  align-self: end;
  opacity: 0.5;
}
#line-numbers {
  text-align: right;
  opacity: 0.1;
  padding-top: 0.5em;
  padding-right: 1em;
  grid-area: 1/ 1/ 2/ 2;
}
#code-field {
  grid-area: 1/ 2/ 2/ 6;
  height: 30em;
  width: 100ch;
  padding: 0.5em;

  border-color: #333;
  border-width: 2px;
  border-style: solid;
  border-radius: 10px;

  // box-shadow: rgb(223, 222, 222) 0px 0px 6px 1px inset;
  // background-color: rgba(233, 233, 233, 0.25);
}

#stats {
  font-family: "Roboto Mono", monospace;
  grid-area: 1/ 2/ 2/ 6;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
  border-radius: 0.5em;

  padding: 1.5em;
  background-color: #111213;
  opacity: 0.9;
  display: flex;
  place-content: center;
  align-items: center;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);

  span {
    font-size: 1.5rem;
    padding: 0 1.5em;
  }
}

.line {
  display: block;
  margin: 0.1em 0;
  white-space: nowrap;
  scroll-margin: 0.6em;
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
  align-self: center;
  line-height: 100%;
  font-family: "Roboto Mono", monospace;
}

.icon {
  width: 25px;
  height: 25px;
  opacity: 0.25;
}
.icon:hover {
  opacity: 1;
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
  color: #ff4a4a;
}
.plain {
  color: rgba(255, 255, 255, 0.5);
}
.highlighted {
  background-color: rgba(196, 196, 196, 0.5);
}
.invisible {
  opacity: 0;
}
</style>
