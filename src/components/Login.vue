<template>
  <form>
    <input type="text" id="uname" class="loginField" name="uname" placeholder="email" tabindex="0"><br>
    <input type="text" id="pword" class="loginField" name="pword" placeholder="password"><br>
    <input type="submit" value="Submit" @click="createUserWithEmailAndPassword">
  </form>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
const auth = getAuth();

export default {
  name: "Login",
  data() {
    return {

    };
  },
  methods: {
    handleSubmit() {
      console.log("handle submit called");
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
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
