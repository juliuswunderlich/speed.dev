<template>
  <ResultsSingleView
    @nextSnippet="displayNewSnippet"
    @repeatSnippet="resetSnippet"
    :test-results="testResults"
    v-if="displayStats"
  />
  <div
    v-else
    class="code-display"
    @mousemove="typing = false"
    :style="{ cursor: typing ? 'none' : 'default' }"
  >
    <div id="wrapper">
      <!-- <img id="logo" src="@/assets/java.svg" alt="java logo" /> -->
      <div id="line-numbers">
        <p
          class="line"
          v-for="line_number in numberOfLines"
          :key="line_number.id"
          :style="{
            opacity: getLineNumberOpacity(line_number),
          }"
        >
          {{ line_number }}
        </p>
      </div>
      <div id="code-field" :style="{ borderColor: codeFieldBorderColor }">
        <p
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
        </p>
        <p v-if="loading" class="loading">
          loading snippets<span>.</span><span>.</span><span>.</span>
        </p>
        <span v-if="capsLock" class="caps-warning">caps activated</span>
      </div>
      <!-- <div id="info">
        <img
          src="@/assets/buttonInfo.svg"
          alt="info"
          class="icon"
          v-on:click="showInfo"
        />
      </div> -->
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
    </div>
  </div>
</template>


<script>
import ResultsSingleView from "./ResultsSingleView.vue";

export default {
  name: "CodeDisplay",
  components: { ResultsSingleView },
  data() {
    return {
      fs: null,
      loading: true,
      text: {},
      INDENT_EM: 1.6,
      START_SCROLL_AFTER_LINE: 2,
      scrolledDown: 0,

      //typing logic
      currentLine: 0,
      cursorPosition: 0,
      charsTyped: [],
      preventDefaultKeys: ["Tab", "/", "'", " ", "Enter"],
      typing: false,
      capsLock: false,
      
      //scroll
      lineElements: [],
      lineNumberElements: [],

      //timer
      timerRunning: false,
      msRunning: 0,
      startTime: 0,
      endTime: 0,

      //stats
      keysTyped: [],
      displayStats: false,
      testResults: null,
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
    getLineNumberOpacity(lineNumber) {
      return lineNumber <= this.currentLine + 1 ? "0.3" : "0";
    },
    onkeydown(event) {
      let key = event.key;
      this.capsLock = event.getModifierState("CapsLock");
      if (this.preventDefaultKeys.includes(key)) {
        event.preventDefault();
      }
      if (this.displayStats) {
        if (key == "Tab") {
          this.displayStats = false;
          this.displayNewSnippet();
        }
        return;
      }
      if (key === "Tab") {
        if (this.timerRunning) {
          this.resetSnippet();
        } else {
          this.displayNewSnippet();
        }
        return;
      }
      this.typing = true;
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
          let lineElemToScrollTo = this.lineNumberElements[this.scrolledDown];
          lineElemToScrollTo.scrollIntoView({ behavior: "smooth" });
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
        let lineElemToScrollTo = this.lineNumberElements[this.scrolledDown];
        lineElemToScrollTo.scrollIntoView({ behavior: "smooth" });
      }
    },
    snippetFinished() {
      this.stopTimer();
      this.displayStats = true;

      const metrics = {
        snippetId: this.text.id,
        netWpm: Math.round(this.netWpm * 100) / 100,
        rawWpm: Math.round(this.rawWpm * 100) / 100,
        accuracy: Math.round(this.accuracy * 100) / 100,
        secondsTotal: Math.round(this.secondsTotal * 100) / 100,
      };

      const results = {
        metrics: metrics,
        lines: this.text.lines,
        keysTyped: this.keysTyped,
        charsTyped: this.charsTyped,
      };
      this.testResults = results;
      // this.$store.commit("newTestCompleted", payload);

      // this.$root.$emit('snippetFinished', {results: results, keysTyped: this.keysTyped, charsTyped: this.charsTyped})

      // const userId = "niklasLuehrUserId"; //TODO!
      // this.fs
      //   .collection("tests")
      //   .add({
      //     userId: userId,
      //     finishedAt: this.$firebase.firestore.FieldValue.serverTimestamp(),
      //     ...metrics,
      //   })
      //   .then(() => {
      //     console.log("Test results saved.");
      //   })
      //   .catch((error) => {
      //     console.error("Error writing test: ", error);
      //   });
    },
    async displayNewSnippet() {
      //offline:
      // const text = require("../../backend/utils/Codes/codes_java_math.json")[
      //   Math.floor(Math.random() * 20)
      // ];
      // if (text.lines[0].content[text.lines[0].content.length - 1] !== "↵") {
      //   for (let l = 0; l < text.lines.length; l++) {
      //     text.lines[l].content = text.lines[l].content += "↵";
      //   }
      // }
      // this.text = text;
      // this.resetSnippet();

      this.text = await this.$store.dispatch("popRandomSnippet");
      this.loading = false;
      this.resetSnippet();
    },
    async resetSnippet() {
      this.displayStats = false;

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

      await this.$nextTick();
      document.querySelector("#code-field").scrollTo(0, 0);
      document.querySelector("#line-numbers").scrollTo(0, 0);

      this.lineElements = document.querySelector("#code-field").children;
      this.lineNumberElements = document.querySelector("#line-numbers").children;

      this.resetTimer();
    },
    showInfo() {
      //TODO
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
      if (this.text.lines) {
        return this.text.lines.length;
      } else {
        return 3;
      }
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
    codeFieldBorderColor() {
      return this.capsLock ? "#ff4a4a" : "#333";
    },
    formattedTime() {
      let minutes = Math.floor(this.secondsTotal / 60);
      let seconds = Math.floor(this.secondsTotal % 60);
      return minutes + ":" + seconds.toString().padStart(2, "0");
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
      return Math.max(
        0,
        this.rawWpm - this.numUncorrectedErrors / this.minutesTotal
      );
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

    this.fs = this.$firebase.firestore();
  },
  mounted() {
    this.displayNewSnippet();
  },
  beforeUnmount() {
    // remove keyListener
    //TODO: maybe a cleaner way to do this?
    document.onkeydown = undefined;
  },
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
* {
  box-sizing: border-box;
}
.code-display {
  cursor: default;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

#wrapper {
  height: 75%;
  max-height: 75%;
  font-family: "Hack", monospace;
  font-size: 1.1rem;
  color: white;

  display: grid;
  grid-template-columns: 50px 50px auto 50px 50px;
  grid-template-rows: auto 30px;
  row-gap: 1.5em;

  /* center snippet without line numbers -> deduct half the width of #line-numbers (50px) */
  transform: translateX(calc(-25px));
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
  overflow: hidden;
  padding-top: 0.5em;
  padding-right: 1em;
  grid-area: 1/ 1/ 2/ 2;
}

#code-field {
  position: relative;
  grid-area: 1/ 2/ 2/ 6;
  width: 100ch;
  padding: 0.5em;
  overflow: hidden;

  border-style: solid;
  border-width: 2px;
  border-radius: 10px;
}

.line {
  // display: block;
  margin: 0.1em 0;
  white-space: nowrap;
  scroll-margin: 0.6em;
}

.loading {
  margin: 0;
  position: absolute;
  top: 0.7em;
  left: 0.7em;
}

.loading span {
  font-size: 1.1em;
  animation-name: blink;
  animation-duration: 1.4s;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
}

.loading span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0% {
    opacity: 0.2;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}

.caps-warning {
  position: absolute;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  bottom: 0.8em;
  right: 1.2em;
  color: #ff4a4a;
  font-size: 0.7em;
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
  grid-area: 2/ 3/ 3/ 5;
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
