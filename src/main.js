import { createApp } from 'vue'
import App from './App.vue'
import { firebase } from '@firebase/app'
import '@firebase/firestore'

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: "AIzaSyCwjSBgc-3bkrJI09lDo2p1szE4BJ5Qe-I",
  authDomain: "speeddev-b728a.firebaseapp.com",
  projectId: "speeddev-b728a",
});


const app = createApp(App);

// make firebase accessible in all Vue components
app.config.globalProperties.$firebase = firebase;

app.mount('#app');