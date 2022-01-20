<template>
  <div>
    <p>ResultsSingleView</p>
    <div id="stats">
      <span>{{ Math.round(netWpm) }}wpm</span>
      <span>{{ Math.round(rawWpm) }}raw</span>
      <span>{{ Math.round(accuracy) }}%</span>
      <span>{{ secondsTotal.toFixed(2) }}s</span>
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
