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
    <!-- <router-link id="login" class="right" :to="routerTarget">{{ statusText }}</router-link> -->
    <span>Login (coming soon)</span>
  </div>

  <router-view @loggedIn="loggedIn" @loggedOut="loggedOut"></router-view>

  <div id="footer">
    <ul>
      <!-- <li><a href="/"> Impressum </a></li> -->
      <li>
        <a href="https://github.com/juliuswunderlich/speed.dev"> GitHub </a>
      </li>
      <!-- <li><a href="https://twitter.com"> Twitter </a></li> -->
    </ul>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  data() {
    return {
      fs: null,
      user: null,
      statusText: "Login",
    };
  },
  created() {
    this.$store.dispatch("loadSnippets");

    this.$firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // logged in
        console.log("user logged in");
        this.user = user;
        console.log(user);
        this.statusText = "Logout";
      } else {
        // logged out
        console.log("user logged out");
        this.user = null;
      }
    });
  },
  computed: {
    routerTarget() {
      if (this.user) {
        // logged in
        return "/login";
      } else {
        // logged out
        return "/logout";
      }
    },
  },
  methods: {
    loggedIn() {},
    loggedOut() {},
  },
};
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
  background-color: var(--background);
}

#app {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  // max-height: 100%;
  color: var(--primary);
  margin: 0em 10%;
  padding: 1em;

  @media only screen and (max-width: 1750px) {
    margin: 0;
  }
}

#header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;

  #logo {
    max-width: 80px;
  }

  #login {
    text-decoration: none;

    &:hover {
      font-weight: bold;
      cursor: pointer;
    }
  }
}

#nav {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
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
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;

    li {
      float: left;
    }

    a {
      text-decoration: none;
      color: var(--primary);
      display: block;
      padding-right: 1.6em;

      &:hover {
        font-weight: bold;
      }
    }
  }
}
</style>
