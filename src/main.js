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
  { path: '/register', component: Register },
  { path: '/stats', component: Stats },
  { path: '/results', component: ResultsSingleView },
  { path: '/settings', component: Settings }
]


// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.

// Create a new store instance.
const store = createStore({
  state() {
    return {
      userLoggedIn: false,
      snippets: [],
      initialSnippetsLoaded: Promise,
      lastTestResults: {}
    }
  },
  mutations: {
    logInUser(state) {
      state.userLoggedIn = true;
    },
    logOutUser(state) {
      state.userLoggedIn = false;
    },
    // storeNewSnippets(state, newSnippets) {
    //   state.snippets.push(...newSnippets)
    // },
    setSnippets(state, newSnippets) {
      state.snippets = newSnippets
    },
    setInitialSnippetsLoadedPromise(state, promise) {
      state.initialSnippetsLoaded = promise;
    },
    newTestCompleted(state, testResults) {
      state.lastTestResults = testResults;
    }
  },
  actions: {
    //load snippets from firestore, for now all of them
    loadSnippets({ commit }) {
      const promise = new Promise(function (resolve) {
        firebase.firestore()
        .collection("snippets")
        .get()
        .then((querySnapshot) => {
          //store doc id as field inside doc
          let snippets = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))

          //add return symbols at end of each line
          for (let s = 0; s < snippets.length; s++) {
            for (let l = 0; l < snippets[s].lines.length; l++) {
              snippets[s].lines[l].content = snippets[s].lines[l].content +=
                "↵";
            }
          }
          commit('setSnippets', snippets);
          resolve();
        });
      })
      commit("setInitialSnippetsLoadedPromise", promise)
      
    },
    async popRandomSnippet({ state, commit }) {
      //wait until any snippets have been loaded before popping one
      await state.initialSnippetsLoaded

      //TODO: if there are less than x snippets buffered, load new ones
      
      const newSnippets = [...state.snippets]
      const removedItem = newSnippets.splice(Math.floor(Math.random() * newSnippets.length), 1)[0];
      commit('setSnippets', newSnippets)
      return removedItem
    }
  }
})





// Now the app has started!


const app = createApp(App);
//app.use(VueRouter)

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHashHistory(),
  routes, // short for `routes: routes`
})

app.use(router)
app.use(store)
// Make sure to _use_ the router instance to make the
// whole app router-aware.

// make firebase accessible in all Vue components
app.config.globalProperties.$firebase = firebase;

app.mount('#app');