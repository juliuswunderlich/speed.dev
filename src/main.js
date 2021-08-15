import { createApp } from 'vue'
import App from './App.vue'

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
    apiKey: "AIzaSyCwjSBgc-3bkrJI09lDo2p1szE4BJ5Qe-I",
    authDomain: "speeddev-b728a.firebaseapp.com",
    projectId: "speeddev-b728a",
  });
  
  var db = firebase.firestore();


// load the parsed snippets
var snippetsJson = require('./codes_java.json');

db.collection("snippets").add(snippetsJson[0])
.then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
})
.catch((error) => {
    console.error("Error adding document: ", error);
});

createApp(App).mount('#app')
