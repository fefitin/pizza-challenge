<template>
  <main id="main">
    <div id="splash">
      <form @submit.prevent="registro">
        <img src="~@/assets/logo.jpeg" alt="Pizza Challenge 2019" />

        <input v-model="nombre" type="text" required placeholder="Nombre" />
        <input v-model="email" type="email" required placeholder="E-mail" />
        <input v-model="password" type="password" required placeholder="Contraseña" />
        <button type="submit">Enviar</button>

      </form>
    </div>
    <router-link to="/login" class="volver">No quiero registrarme ahora</router-link>
  </main>
</template>

<script>
import { firebase } from '@firebase/app'
import '@firebase/auth'

export default {
  name: "Registro",
  data: () => ({
    nombre: null,
    email: null,
    password: null
  }),
  mounted() {},
  methods: {
    registro() {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(result => {
        result.user.updateProfile({ displayName: this.nombre });
        this.$router.push('/');
      }).catch(err => {
        const errors = {
          'auth/email-already-in-use': 'El e-mail ingresado ya está registrado.',
          'auth/invalid-email': 'El e-mail ingresado es inválido.',
          'auth/operation-not-allowed': 'Error al registrar.',
          'auth/weak-password': 'La contraseña ingresada es muy débil.'
        };

        alert(errors[err.code]);
      });
    }
  }
};
</script>
