<template>
  <div id="header">
    <span id="logo">[speed.dev]</span>
    <span id="login">Login</span>
  </div>
  <div id="nav">
    <img src="@/assets/home.svg" alt="Home"/>
    <img src="@/assets/stats.svg" alt="Statisctics"/>
    <img src="@/assets/settings.svg" alt="Settings"/>
  </div>
  <CodeDisplay></CodeDisplay>
  <div id="footer">
    <ul>
      <li><a href="#"> Impressum </a></li>
      <li><a href="https://github.com/juliuswunderlich/speed.dev"> GitHub </a></li>
      <li><a href="https://twitter.com"> Twitter </a></li>
    </ul>
  </div>
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

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap');

html,
body {
  margin: 0;
  padding: 0;
  font-family: 'Roboto Mono', monospace;;
}

body {
  height: 100vh;
  width: 100vw;
  background-color: #151718;
}

#header {
  display: flex;
  place-content: space-between;
  padding: 1em;

  #logo {
    font-size: 1.5em;
  }
  #login {
    margin: .8em;
  }
}

#nav {
  position: absolute;
  left: 10px;
  display: flex;
  flex-direction: column;
  top: 35%;
  transform: translateY(-50%);

  img {
    width: 30px;
    height: 30px;
    opacity: 75%;
    margin: .75em .6em;

    &:hover {
      opacity: 100%;
      cursor: pointer;
     transform: scale(1.1);
    }

    &:active {
      transform: scale(1.2);
    }
  }

}

#footer {
  padding: .5em 1em;
  position: absolute;
  bottom: 0;

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;

    li {
      float: left;
    }

    a {
      text-decoration: none;
      color: #C4C4C4;
      display: block;
      text-align: center;
      padding: .8em;

      &:hover {
        font-weight: bold;
      }
    }
  }
}

#app {
  color: #C4C4C4;
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
