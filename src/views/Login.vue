<template>
  <main id="main" class="centered">
    <div id="splash">
      <form @submit.prevent="login">
        <img src="~@/assets/logo.jpeg" alt="Pizza Challenge 2019" />
        
        <input v-model="email" type="email" required placeholder="E-mail" />
        <input v-model="password" type="password" required placeholder="Contraseña" />
        
        <button v-if="working" type="button">Espera...</button>
        <button v-if="!working" type="submit">Entrar</button>
        <ul class="links">
          <li><router-link to="/login/recuperar">Olvidé mi contraseña</router-link></li>
        </ul>

        <button type="button" class="facebook" @click.prevent="facebook()">Entrar con Facebook</button>
        <button type="button" class="secondary user"><router-link to="/registro" class="button secondary">Crear una cuenta</router-link></button>
      </form>
    </div>
  </main>
</template>

<script>
import { firebase } from '@firebase/app'
import '@firebase/auth'

export default {
  name: "Login",
  data: () => ({
    email: null,
    password: null,
    working: false
  }),
  mounted() {},
  methods: {
    login() {
      this.working = true;
      
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(result => {
        this.$router.push('/');
      }).catch(err => {
        const errors = {
          'auth/invalid-email': 'El e-mail ingresado es inválido.',
          'auth/user-disabled': 'El usuario está deshabilitado.',
          'auth/user-not-found': 'Contraseña inválida.',
          'auth/wrong-password': 'Contraseña inválida.'
        };

        alert(errors[err.code]);
        this.working = false;
      });
    },
    facebook() {
      // Sign in using a popup.
      var provider = new firebase.auth.FacebookAuthProvider();
      firebase.auth().signInWithPopup(provider).then(result => {
        this.$router.push('/');
      });
    }
  }
};
</script>
