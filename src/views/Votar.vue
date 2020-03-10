<template>
  <main v-if="pizzeria" id="main" class="pizzeria">
    <template v-if="cargado && !yaVotaste">
      <template v-if="faltan <= 0">
        <header>
          <h1>{{ pizzeria.nombre }}</h1>
          <h2 v-if="secreto">¡Tenés el voto secreto!</h2>
        </header>
        
        <template v-if="!votando">
          <component :is="slickComp" :options="slickOptions" @init="setActiveVote()" @afterChange="setActiveVote()">
            <div v-for="i in 10" :key="i" :data-voto="i">
              <div class="challenge">
                <span class="dia">{{ i }}</span>
              </div>
            </div>
          </component>

          <button type="button" @click.prevent="votar()">Votar</button>
        </template>
      </template>
      
      <p v-if="faltan == 1" id="faltan"><span>Falta <big>{{ faltan }}</big> jurado en la sala...</span></p>
      <p v-if="faltan > 1" id="faltan"><span>Faltan <big>{{ faltan }}</big> jurados en la sala...</span></p>
    </template>

    <template v-if="cargado && yaVotaste">
      <h1>{{ pizzeria.nombre }}</h1>
  
      <div id="votos">
        <h2>{{ promedio }}</h2>
        <ul>
          <li v-for="(voto, index) in votos" :key="index" :class="{ mio: voto.mio }">
            <span>{{ voto.nombre }}</span>
            <span>{{ voto.secreto ? '?' : (voto.voto ? voto.voto : '-') }}</span>
          </li>
        </ul>
      </div>
      <router-link :to="'/challenges/' + challengeId" class="volver">Seguir votando</router-link>
    </template>
  </main>
</template>

<script>
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import '@firebase/auth';

import api from '@/components/api';
import socket from '@/components/websocket';
import Slick from 'vue-slick';

export default {
  name: "votar",
  components: {
    Slick
  },
  data: () => ({
    cargado: false,
    challengeId: null,
    challenge: null,
    pizzeriaId: null,
    pizzeria: null,
    votando: false,
    votos: [],
    voto: null,
    conectados: 0,
    secreto: false,
    promedio: 0,
    slickOptions: {
      slidesToShow: 3,
      vertical: true,
      verticalSwiping: true,
      centerMode: true,
      centerPadding: (screen.availWidth < 400 ? 53 : 80),
      prevArrow: '<button type="button" class="prev"></button>',
      nextArrow: '<button type="button" class="next"></button>',
      cssEase: 'ease-out',
      speed: 150,
      initialSlide: 4
    },
    slickComp: null
  }),
  computed: {
    yaVotaste() {
      if(!this.challenge.abierto)
        return true;

      return this.votos.filter(v => { return v.uid == firebase.auth().currentUser.uid; }).length > 0;
    },
    faltan() {
      return (this.challenge ? this.challenge.miembros - this.conectados : false);
    }
  },
  mounted() {
    this.challengeId = this.$route.params.challengeId;
    this.pizzeriaId = this.$route.params.pizzeriaId;
    this.load();
  },
  beforeRouteUpdate (to, from, next) {
    this.challengeId = to.params.challengeId;
    this.pizzeriaId = to.params.pizzeriaId;
    this.load();
    next();
  },
  methods: {
    load() {
      this.votos = [];
      this.secreto = false;
      this.cargado = false;
      this.pizzeria = null;

      api.get(`challenges/${this.challengeId}`).then(async (data) => {
        await this.actualizarVotos();
        this.challenge = data;
        this.pizzeria = data.pizzerias.filter(p => { return p.id == this.pizzeriaId; }).pop();
        socket.send('setPizzeriaId', this.pizzeriaId);
        this.votando = false;
        this.cargado = true;
        this.slickComp = 'Slick';
      });

      socket.receive('connected', message => {
        if(this.conectados != message.value) {
          this.conectados = message.value;

          if(this.challenge && this.conectados == this.challenge.miembros)
            socket.send('getVotoSecreto');
        }
      });

      socket.receive('getVotoSecreto', message => {
        this.secreto = message.value;
      });

      socket.receive('actualizarVotos', message => {
        this.actualizarVotos();
      });
    },
    setActiveVote() {
      document.querySelectorAll('.selected').forEach((slide) => { slide.classList.remove('selected'); });
      const current = document.querySelector('.slick-current');
      current.classList.add('selected');
      this.voto = current.firstChild.firstChild.dataset.voto;
    },
    votar() {
      if(this.yaVotaste || this.votando)
        return false;
        
      this.votando = true;

      firebase.firestore().collection('votos').add({
        pizzeriaId: `pizzerias/${this.pizzeriaId}`,
        nombre: firebase.auth().currentUser.displayName,
        voto: parseInt(this.voto),
        secreto: this.secreto,
        uid: firebase.auth().currentUser.uid
      }).then(() => {
        socket.send('notificarVoto');
      }).catch((e) => {
        this.votando = false;
        alert(e.message);
      });
    },
    async actualizarVotos() {
      return api.get(`pizzerias/${this.pizzeriaId}/votos`).then(data => {
        this.votos = data.votos.map((v) => {
          v.mio = (v.uid == firebase.auth().currentUser.uid);
          return v;
        });

        const publicos = this.votos.filter(voto => { return !voto.secreto && typeof voto.voto != 'undefined'; });
        const total = publicos.reduce((acum, current) => {
          return acum + parseInt(current.voto);
        }, 0);
        
        if(total > 0)
          this.promedio = (total / publicos.length).toFixed(2);
      });
    }
  },
};
</script>
