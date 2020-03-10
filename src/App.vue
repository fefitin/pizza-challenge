<template>
  <div id="app">
    <header id="header" v-if="logueado">
      <div class="logo">
        <img src="~@/assets/logo.jpeg" alt="Pizza Challenge 2019" />
      </div>
      <div class="info">
        <div v-if="challenge" class="challenge">
          <h1>{{ moment(challengeId).format('DD/MM') }}</h1>
          <h2>{{ challenge.orden }}° fecha</h2>
        </div>
        <div class="user">
          <p class="name">{{ usuario }}</p>
          <a href="#" @click.prevent="logout()" class="logout">Salir</a>
        </div>
      </div>
    </header>
    <router-view />
  </div>
</template>

<style lang="scss">
@import "@/assets/css/global.scss";
</style>

<script>
import { firebase } from '@firebase/app'
import '@firebase/auth'
import api from '@/components/api';
import websocket from "@/components/websocket";
import moment from 'moment';

export default {
  name: "app",
  data: () => ({
    challengeId: null,
    challenge: null
  }),
  computed: {
    logueado() {
      return firebase.auth().currentUser;
    },
    usuario() {
      return firebase.auth().currentUser.displayName;
    }
  },
  watch: {
    $route() {
      this.init();
    }
  },
  mounted() {
    document.getElementById('app').style.minHeight = window.innerHeight + 'px';
    if(this.logueado) {
      this.init();
    }
  },
  methods: {
    init() {
      const route = this.$router.match(location.pathname);
      if(route.params.challengeId) {
        this.challengeId = route.params.challengeId;
        api.get(`challenges/${this.challengeId}`).then(data => {
          this.challenge = data;
        });
      } else {
        this.challengeId = null;
        this.challenge = null;
      }      
    },
    logout() {
      firebase.auth().signOut().then(() => {
        this.$router.push('/login');
        websocket.reset();
      });
    },
    moment(date) {
      return moment(date);
    }
  }
};
</script>
