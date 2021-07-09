<template>
  <CodeDisplay></CodeDisplay>
</template>

<script>
import CodeDisplay from './components/CodeDisplay.vue'

export default {
  name: 'App',
  components: {
    CodeDisplay
  }
}
</script>

<style>

html,
body {
  margin: 0;
  padding: 0;
}

body {
  height: 100vh;
  width: 100vw;
  background-color: #151718;
}

/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
