<template>
  <div class="stats">
    <div id="metrics">
      <span class="wpm">{{ Math.round(results.netWpm) }}wpm</span>
      <span>{{ Math.round(results.rawWpm) }}raw</span>
      <span>{{ Math.round(results.accuracy) }}%</span>
      <span>{{ results.secondsTotal.toFixed(2) }}s</span>
    </div>
    <div id="text">
      <p class="line" v-for="(line, lineIndex) in keysTyped" :key="line.id">
        <span
          class="line-number"
          :style="{
            marginRight: getIndent(lineIndex) + 'em',
          }"
        >
          {{ lineIndex + 1 }}
        </span>
        <span
          v-for="(char, charIndex) in line"
          :class="getClassAt(lineIndex, charIndex)"
          :key="char.id"
          >{{ getCharacterAt(lineIndex, charIndex) }}</span
        >
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ResultsSingleView",
  data() {
    return {
      results: {},
      keysTyped: [],
      // charsTyped: [],
      lines: [],
      correctMap: [],

      preventDefaultKeys: ["Tab", "/", "'", " ", "Enter"],
      INDENT_EM: 1.6,
    };
  },
  methods: {
    getIndent(lineIndex) {
      return 2 + this.lines[lineIndex].indent * this.INDENT_EM;
    },
    getClassAt(lineIndex, charIndex) {
      return this.correctMap[lineIndex][charIndex];
    },
    getCharacterAt(lineIndex, charIndex) {
      let char = this.keysTyped[lineIndex][charIndex];
      if (char === " " && this.getClassAt(lineIndex, charIndex) !== "correct") {
        return "_";
      } else {
        return char;
      }
    },
  },
  created() {
    document.onkeydown = (event) => {
      if (this.preventDefaultKeys.includes(event.key)) {
        event.preventDefault();
      }
      if (event.key === "Tab") {
        this.$router.push("/");
      }
    };
    const { metrics, lines, keysTyped, charsTyped } =
      this.$store.state.lastTestResults;
      console.log(this.$store.state.lastTestResults);
    this.results = metrics;
    this.keysTyped = keysTyped;
    this.lines = lines;

    //generate correct/incorrect map
    const correctMap = [];
    keysTyped.forEach((line, lineIndex) => {
      let charsIndex = 0;
      let lineMap = [];
      for (const key of line) {
        if (key === lines[lineIndex].content[charsIndex]) {
          lineMap.push("correct");
          charsIndex++;
        } else {
          if (key === charsTyped[lineIndex][charsIndex]) {
            lineMap.push("uncorrected");
            charsIndex++;
          } else {
            lineMap.push("corrected");
          }
        }
      }
      correctMap.push(lineMap);
    });

    this.correctMap = correctMap;
  },
  beforeUnmount() {
    // remove keyListener
    //TODO: maybe a cleaner way to do this?
    document.onkeydown = undefined;
  },
};
</script>

<style scoped lang="scss">
.stats {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

#metrics {
  display: flex;
  align-items: baseline;
  gap: 2em;
  margin-bottom: 1em;

  .wpm {
    font-size: 2rem;
    font-weight: bold;
  }

  > span {
    font-size: 1.2rem;
  }
}

#text {
  padding: 0.5em 1.5em;
  border: 1px solid #c4c4c4;
  border-radius: 0.5em;
  overflow: auto;
  height: 55%;
  width: 80ch;
}

.line {
  margin: 0.1em 0;
}

.line-number {
  display: inline-block;
  text-align: right;
  width: 3ch;

}
.correct {
  /*background-color: rgba(0, 255, 0, .1);*/
  color: white;
}

.uncorrected {
  /*background-color: rgba(255, 0, 0, .1);*/
  background-color: #ff4a4a;
}

.corrected {
  color: #ff4a4a;
}
//TODO: class corrected: rote schrift
//vs. class wrong: roter hintergrund (also unkorrigierte fehler)
</style>
