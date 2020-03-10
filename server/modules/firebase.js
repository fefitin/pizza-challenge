/*
  Inicializar conexión con Firebase
*/
const firebase = require('firebase-admin');
require('firebase/auth')
require('firebase/firestore')

// Firebase config
var serviceAccount = require("./../firebase/credentials.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: process.env.VUE_APP_PIZZA_CHALLENGE_DB_URL
});

module.exports = firebase; 