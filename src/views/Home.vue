<template>
  <main id="main" class="home">
    <div id="challenges">
      <component :is="slickComp" :options="slickOptions" @init="setActiveChallenge()" @afterChange="setActiveChallenge()">
        <div v-for="(challenge, index) in challenges" :key="index" :data-id="challenge.id">
          <div class="challenge">
            <span class="dia">{{ moment(challenge.id).format('DD') }}</span>
            <span class="mes">{{ moment(challenge.id).format('MMM') }}</span>
          </div>
        </div>
      </component>
    </div>
    <button v-if="this.challenge && (this.challenge.abierto || this.challenge.cerrado)" type="button">
      <router-link v-if="this.challenge.abierto" :to="`/challenges/${challenge.id}`">Iniciar votación</router-link>
      <router-link v-if="this.challenge.cerrado" :to="`/challenges/${challenge.id}`">Ver resultados</router-link>
    </button>
    <button v-if="this.challenge && !(this.challenge.abierto || this.challenge.cerrado)" type="button" class="secondary">
      No disponible
    </button>
  </main>
</template>

<script>
import api from '@/components/api';
import moment from 'moment';
import Slick from 'vue-slick';

export default {
  name: "home",
  components: {
    Slick
  },
  data: () => ({
    challenges: [],
    challenge: null,
    slickOptions: {
      slidesToShow: 3,
      vertical: true,
      verticalSwiping: true,
      centerMode: true,
      centerPadding: (screen.availWidth < 400 ? 53 : 80),
      prevArrow: '<button type="button" class="prev"></button>',
      nextArrow: '<button type="button" class="next"></button>',
      cssEase: 'ease-out',
      speed: 150
    },
    slickComp: null
  }),
  mounted() {
    api.get('challenges').then(data => {
      this.challenges = data.challenges;
      this.slickComp = 'Slick';
    });
  },
  methods: {
    moment(date) {
      return moment(date);
    },
    setActiveChallenge() {
      document.querySelectorAll('.selected').forEach((slide) => { slide.classList.remove('selected'); });
      const current = document.querySelector('.slick-current');
      current.classList.add('selected');
      this.challenge = this.challenges.filter((c) => { return c.id == current.firstChild.firstChild.dataset.id }).pop();
    }
  }  
};
</script>
