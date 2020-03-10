import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from "firebase/app";
import websocket from "@/components/websocket";
import moment from 'moment';

Vue.config.productionTip = false;

var firebaseConfig = {
  apiKey: "AIzaSyDJKokSmxUm9ohEdwwN5Xt5tH1M1lrYwSI",
  authDomain: "pizza-challenge-c7d05.firebaseapp.com",
  databaseURL: "https://pizza-challenge-c7d05.firebaseio.com",
  projectId: "pizza-challenge-c7d05",
  storageBucket: "pizza-challenge-c7d05.appspot.com",
  messagingSenderId: "979644533541",
  appId: "1:979644533541:web:7e6345e9aafd6260cb68cc"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

websocket.init().then(() => {

  firebase.auth().onAuthStateChanged(() => {

    moment.locale('es', {
      monthsShort: 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_')
    });
    
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
    
  });

});