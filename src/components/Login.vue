<template>
  <form>
    <input type="text" id="email" class="loginField" name="email" placeholder="email" tabindex="0" v-model="email"><br>
    <input type="text" id="pword" class="loginField" name="pword" placeholder="password" v-model="password"><br>
    <input type="submit" value="Submit" @click="handleSubmit">
    <message-bar type="success" message="This is a huge success guys!"/>
    <message-bar type="error" message="Oof. An error occured. Bummer."/>
    <message-bar type="warning" message="Pass auf, Bursche!"/>
    <message-bar type="info" message="Nur zur Info!"/>
  </form>
</template>

<script>
import MessageBar from './MessageBar.vue';
//import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default {
  components: { MessageBar },
  name: "Login",
  data() {
    return {
      email : "",
      password: ""
    };
  },
  methods: {
    handleSubmit() {
      this.$firebase.auth()
      .createUserWithEmailAndPassword(this.email, this.password)
      .then((userCredential) => {
          console.log("handle submit called");
          // Signed in 
          const user = userCredential.user;
          console.log("user: " + user);
          // ...
        })
        .catch((error) => {
          /*
          const errorCode = error.code;
          const errorMessage = error.message;
          */
          console.log(error);
          // ..
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
