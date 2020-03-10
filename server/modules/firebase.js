/*
  Inicializar conexión con Firebase
*/
const firebase = require('firebase-admin');
require('firebase/auth')
require('firebase/firestore')

// Firebase config
var serviceAccount = JSON.parse(new Buffer.from(process.env.VUE_APP_PIZZA_CHALLENGE_DB_CREDENTIALS, 'base64'));

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: process.env.VUE_APP_PIZZA_CHALLENGE_DB_URL
});

module.exports = firebase; 