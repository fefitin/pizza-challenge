const firestoreService = require('firestore-export-import');
const serviceAccount = JSON.parse(new Buffer.from(process.env.VUE_APP_PIZZA_CHALLENGE_DB_CREDENTIALS, 'base64'));
 
// Initiate Firebase App
firestoreService.initializeApp(serviceAccount, process.env.VUE_APP_PIZZA_CHALLENGE_DB_URL);
 
// Start exporting your data
firestoreService
  .backups(['challenges', 'pizzerias', 'votos'])
  .then(data => console.log(JSON.stringify(data)));
