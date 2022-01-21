<template>
  <div id="header">
    <router-link to="/">
      <img id="logo" src="@/assets/logo.svg" alt="Logo" />
    </router-link>
    <div id="nav">
      <router-link to="/">
        <img src="@/assets/home.svg" alt="Home" />
      </router-link>
      <router-link to="/stats">
        <img src="@/assets/stats.svg" alt="Statisctics" />
      </router-link>
      <router-link to="/settings">
        <img src="@/assets/settings.svg" alt="Settings" />
      </router-link>
    </div>
    <router-link v-show="!this.$store.state.userLoggedIn" class="login" to="/login">Login</router-link>
    <a v-if="this.$store.state.userLoggedIn" class="login" @click="logout">Logout</a>

  </div>

  <router-view></router-view>

  <div id="footer">
    <ul>
      <li><a href="/"> Impressum </a></li>
      <li>
        <a href="https://github.com/juliuswunderlich/speed.dev"> GitHub </a>
      </li>
      <li><a href="https://twitter.com"> Twitter </a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  data() {
    return {
    }
  },
  created() {
  },
  computed: {
  },
  methods: {
    logout() {
      // TODO: move this into the store to have a single point?
      // TODO: also do it with login?
      this.$firebase.auth().signOut()
        .then(() => {
            this.$store.commit("logoutUser")
            this.$router.push('/')
      })
        .catch((error) => {
        // XXX
        console.log(error);
      });
    }
  }
}
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap");

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  font-family: "Roboto Mono", monospace;
}

body {
  height: 100vh;
  width: 100vw;
  background-color: #151718;
}

#app {
  position: relative;
  height: 100vh;
  color: #c4c4c4;
  margin: 0em 10%;
  padding: 1em;

  @media only screen and (max-width: 1750px) {
    margin: 0;
  }
}

#header {
  display: flex;
  align-items: center;
  place-content: space-between;

  #logo {
    max-width: 80px;
  }

  .login {
    text-decoration: none;
    color: #c4c4c4;

    &:hover {
      font-weight: bold;
      cursor: pointer;
    }
  }
}

#nav {
  display: flex;
  align-items: center;
  flex-direction: row;

  img {
    width: 25px;
    height: 25px;
    opacity: 0.75;
    margin: 0em 0.75em;

    &:hover {
      opacity: 1;
      cursor: pointer;
      transform: scale(1.1);
    }

    &:active {
      transform: scale(1.2);
    }
  }
}

#footer {
  position: absolute;
  bottom: 0em;
  padding-bottom: inherit;

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;

    li {
      float: left;
    }

    a {
      text-decoration: none;
      color: #c4c4c4;
      display: block;
      padding-right: 1.6em;

      &:hover {
        font-weight: bold;
      }
    }
  }
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
