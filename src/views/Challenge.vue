<template>
  <main v-if="challenge" id="main" class="challenge">
      <ul>
        <li v-for="(pizzeria, index) in pizzerias" :key="index">
          <button :class="{ votaste: pizzeria.yaVotaste }">
            <router-link :to="'/challenges/' + challengeId + '/' + pizzeria.id">
              <span>
                <h2>{{ pizzeria.nombre }}</h2>
                <p v-if="!pizzeria.yaVotaste">¡Votar ahora!</p>
                <p v-if="pizzeria.yaVotaste">Tu voto: <strong>{{ pizzeria.tuVoto }}</strong></p>
              </span>
            </router-link>
          </button>
        </li>
      </ul>
      <router-link to="/" class="volver">Volver al listado de fechas</router-link>
  </main>
</template>

<script>
import api from '@/components/api';
import { firebase } from '@firebase/app';
import '@firebase/auth';

export default {
  name: "challenge",
  data: () => ({
    challengeId: null,
    challenge: null,
    pizzerias: null
  }),
  mounted() {
    this.challengeId = this.$route.params.challengeId;
    this.load();
  },
  beforeRouteUpdate (to, from, next) {
    this.challengeId = to.params.challengeId;
    this.load();
    next();
  },
  methods: {
    load() {
      api.get(`challenges/${this.challengeId}`).then(async (data) => {
        this.challenge = data;
        if(!this.challenge.abierto && !this.challenge.cerrado)
          this.$router.push('/challenges');
          
        const pizzerias = data.pizzerias.map(async (p) => {
        
          const votos = await api.get(`pizzerias/${p.id}/votos`);
          const yaVotaste = votos.votos.filter((v) => {
            return (v.uid == firebase.auth().currentUser.uid);
          });

          p.yaVotaste = (yaVotaste.length > 0);
          if(p.yaVotaste)
            p.tuVoto = (yaVotaste[0].secreto ? '?' : (typeof yaVotaste[0].voto != 'undefined' ? yaVotaste[0].voto : '-'));
          else
            p.tuVoto = null;

          return p;

        });

        Promise.all(pizzerias).then((pizzerias) => {
          this.pizzerias = pizzerias;
        });

      });
    }
  },

};
</script>
