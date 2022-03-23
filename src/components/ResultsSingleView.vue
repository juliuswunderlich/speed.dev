<template>
  <div class="stats">
    <div id="metrics">
      <span class="wpm">{{ Math.round(results.netWpm) }}wpm</span>
      <span>{{ Math.round(results.rawWpm) }}raw</span>
      <span>{{ Math.round(results.accuracy) }}%</span>
      <span>{{ results.secondsTotal.toFixed(2) }}s</span>
    </div>
    <div id="text">
      <p
        class="line"
        v-for="(line, lineIndex) in keysTyped"
        :key="line.id"
        :style="{
          paddingLeft: getIndent(lineIndex) + 'em',
        }"
      >
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

      INDENT_EM: 1.6,
    };
  },
  methods: {
    getIndent(lineIndex) {
      return this.lines[lineIndex].indent * this.INDENT_EM;
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
    const { metrics, lines, keysTyped, charsTyped } =
      this.$store.state.lastTestResults;
    this.results = metrics;
    this.keysTyped = keysTyped;
    // this.charsTyped = charsTyped;
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
    console.log(correctMap);
    // this.$root.$on("snippetFinished", (data) => {
    //   this.results = data.results;
    //   this.keysTyped = data.keysTyped;
    // });
    //TODO: replace this by state management
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

  > span{
    font-size: 1.2rem;
  }
}

#text {
  padding: 0.5em 1.5em;
  border: 1px solid #c4c4c4;
  border-radius: 0.5em;
  overflow: auto;
}
.line {
  margin: 0.1em 0;
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
