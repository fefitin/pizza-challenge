<template>
  <main id="main">
    <div id="splash">
      <form @submit.prevent="login">
        <img src="~@/assets/logo.jpeg" alt="Pizza Challenge 2019" />

        <input v-model="email" type="email" required placeholder="E-mail" />
        <button type="submit">Recuperar</button>
      </form>
    </div>
    <router-link to="/login" class="volver">Volver</router-link>
  </main>
</template>

<script>
import { firebase } from '@firebase/app'
import '@firebase/auth'

export default {
  name: "Recuperar",
  data: () => ({
    email: null,
    password: null
  }),
  mounted() {},
  methods: {
    login() {
      firebase.auth().sendPasswordResetEmail(this.email, {
        url: location.href.replace('/login/recuperar', '/login')
      }).then(user => {
        alert('Te enviamos un e-mail para que crees una nueva contraseña.');
        this.$router.push('/login');
      }).catch(err => {
        const errors = {
          'auth/invalid-email': 'El e-mail ingresado es inválido.',
          'auth/missing-continue-uri': 'URL obligatoria.',
          'auth/invalid-continue-uri': 'URL inválida.',
          'auth/unauthorized-continue-uri': 'URL no autorizada.',
          'auth/user-not-found': 'El e-mail ingresado no está registrado.'
        };

        alert(errors[err.code]);
      });
    }
  }
};
</script>
