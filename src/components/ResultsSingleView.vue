<template>
  <div>
    <p>ResultsSingleView</p>
    <div id="stats">
      <p>{{ Math.round(results.netWpm) }}wpm</p>
      <p>{{ Math.round(results.rawWpm) }}raw</p>
      <p>{{ Math.round(results.accuracy) }}%</p>
      <p>{{ results.secondsTotal.toFixed(2) }}s</p>
    </div>
    <p v-for="line in keysTyped" :key="line.id">
      <span v-for="char in keysTyped" :key="char.id">char</span>
    </p>
  </div>
</template>

<script>
export default {
  name: "ResultsSingleView",
  data() {
    return {
      results: {},
      keysTyped: [],
    };
  },
  methods: {},
  created() {
    const {metrics, keysTyped} = this.$store.state.lastTestResults;
    this.results = metrics;
    this.keysTyped = keysTyped;

    // this.$root.$on("snippetFinished", (data) => {
    //   this.results = data.results;
    //   this.keysTyped = data.keysTyped;
    // });
    //TODO: replace this by state management
  },
};
</script>

<style scoped lang="scss">
</style>
