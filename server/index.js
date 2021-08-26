require('dotenv').config();
const firebase = require('./modules/firebase.js');
const server = require('./modules/server.js')(firebase);
const socket = require('./modules/websocket.js')(server, firebase);

let port;
if (process.env.NODE_ENV == 'development') {
  port = 9000;
} else {
  port = process.env.PORT;
}

server.listen(port, function() {});
console.log(`Servidor activo en puerto ${port}.`);
