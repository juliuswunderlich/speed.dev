<template>
  <form>
    <input type="text" id="email" class="loginField" name="email" placeholder="email" tabindex="0" v-model="email">
    <input type="text" id="pword" class="loginField" name="pword" placeholder="password" v-model="password">
    <input type="submit" value="Submit" @click="handleSubmit">
    <div id=userMsg>
      <p class="inline">New user? Go and</p><router-link id="register" class="inline" to="/register">register!</router-link>
    </div>
    <message-bar v-if="displayMsg" type="error" :message="logMsg" />
  </form>
</template>

<script>
import MessageBar from './MessageBar.vue';

export default {
  components: { MessageBar },
  name: "Login",
  data() {
    return {
      email : "",
      password: "",
      displayMsg: false,
      logMsg: ""

    };
  },
  methods: {
    handleSubmit() {
      this.$firebase.auth()
      .signInWithEmailAndPassword(this.email, this.password)
      .then((/*userCredential*/) => {
          // Signed in 
          this.$emit('loggedIn');
        })
        .catch((error) => {
          console.log(error);
          this.logMsg = "Failed to login your average looking face!";
          this.displayMsg = true;
          setTimeout(() => {
            console.log("babahujaaaaaaa");
            this.displayMsg = false;
          }, 1000);
        });
    }
    
  }
}

</script>

<style scoped lang="scss">
  form {
    display: flex;
    align-items: center;
    flex-direction: column;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    #pword {
      margin: 0 0 25px;
    }
  }

  .loginField {
    border-radius: 25px;
    height: 50px;
    background-color: #151718;
    border-color: lightskyblue;
    border-style: solid;
    border-width: 1px;
  }

  input[type=submit] {
    padding:5px 15px;
    width: 50%;
    left: unset;
    transform: unset;
    /* background:#ccc;*/
    background: none;
    border:1px solid var(--primary);
    border-radius: 5px;
    cursor:pointer;
    -webkit-border-radius: 5px;
    border-radius: 25px;
  }

  input {
    text-align: center;
    color: var(--primary);
    margin-bottom: 10px;
  }

  .inline {
    float: left;
  }

  #userMsg {
    margin: 5px;
    p {
      margin: 0 5px;
    }
    #register {
      text-decoration: none;
      color: lightskyblue;
    }
  }
</style>
