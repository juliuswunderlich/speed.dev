import { createApp } from 'vue'
import App from './App.vue'
import { firebase } from '@firebase/app'
import '@firebase/firestore'
import { } from '@firebase/auth';
import CodeDisplay from './components/CodeDisplay'
import Login from './components/Login'
import Register from './components/Register'
import Stats from './components/Stats'
import ResultsSingleView from './components/ResultsSingleView'
import Settings from './components/Settings'
// hella clean import <3
import { createRouter, createWebHashHistory } from 'vue-router'
import { createStore } from 'vuex'

//import { Login } from './components/Login'

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: "AIzaSyCwjSBgc-3bkrJI09lDo2p1szE4BJ5Qe-I",
  authDomain: "speeddev-b728a.firebaseapp.com",
  projectId: "speeddev-b728a",
});

// 1. Define route components.
// These can be imported from other files

// 2. Define some routes
// Each route should map to a component.
// We'll talk about nested routes later.
const routes = [
  { path: '/', component: CodeDisplay },
  { path: '/login', component: Login },
  { path: '/register', component: Register},
  { path: '/stats', component: Stats },
  { path: '/results', component: ResultsSingleView },
  { path: '/settings', component: Settings}
]


// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.

// Create a new store instance.
const store = createStore({
  state () {
    return {
      userLoggedIn: false
    }
  },
  mutations: {
    logInUser (state) {
      state.userLoggedIn = true;
    },
    logOutUser (state) {
      state.userLoggedIn = false;
    }
  }
})





// Now the app has started!


const app = createApp(App);
//app.use(VueRouter)

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history : createWebHashHistory(),
  routes, // short for `routes: routes`
})

app.use(router)
app.use(store)
// Make sure to _use_ the router instance to make the
// whole app router-aware.

// make firebase accessible in all Vue components
app.config.globalProperties.$firebase = firebase;

app.mount('#app');