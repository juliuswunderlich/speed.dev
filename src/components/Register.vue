<template>
  <form>
    <input type="text" id="email" class="loginField" name="email" placeholder="email" tabindex="0" v-model="email"><br>
    <input type="text" id="pword" class="loginField" name="pword" placeholder="password" v-model="password"><br>
    <input type="submit" value="Register" @click="handleRegister">
    <message-bar v-if="displayErrorMsg" type="warning" :message="logMsg" />
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
      displayErrorMsg: false,
      logMsg: ""

    };
  },
  methods: {
    handleRegister() {
      this.$firebase.auth()
      .createUserWithEmailAndPassword(this.email, this.password)
      .then((userCredential) => {
          console.log("everything went fine");
          // Signed in 
          const user = userCredential.user;
          console.log(user);
          this.logMsg = "kein Fehler aber testen";
          this.displayErrorMsg = true;
          setTimeout(function () {
            this.displayErrorMsg = false;
          }, 5000);
        })
        .catch((error) => {
          this.displayErrorMsg = true;
          console.log("an error occured", error);
          setTimeout(function () {
            this.displayErrorMsg = false;
            this.logMsg = error;
          }, 5000);
        });
    }
  }
}

</script>

<style>
  form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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
    position: relative;
    left: 50%;
    transform: translate(-50%);
    padding:5px 15px;
    /* background:#ccc;*/
    background: none;
    border:1px solid #c4c4c4;
    border-radius: 5px;
    cursor:pointer;
    -webkit-border-radius: 5px;
    border-radius: 25px;
  }

  input {
    text-align: center;
    color: #c4c4c4;
    margin-bottom: 10px;

  }
</style>
