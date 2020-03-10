/*
  Iniciar servidor WebSocket sobre el servidor
  HTTP recibido como parámetro
*/
const WebSocketServer = require('websocket').server;
const handlers = require('./handlers.js');
var id = 0;

function Client(connection) {
  return {
    id: id++,
    connection: connection,
    pizzeriaId: null,
    secreto: false
  };
}

module.exports = function(server, firebase) {

  const wsServer = new WebSocketServer({
    httpServer: server
  });

  const clients = [];

  wsServer.on('request', function(request) {

    // Registrar nueva conexión
    const connection = request.accept(null, request.origin);
    const thisClient = Client(connection);
    clients.push(thisClient);

    console.log(`Usuario conectado, ${clients.length} activos.`);

    // Recibir mensajes
    connection.on('message', function(message) {
      if (message.type === 'utf8') {
        const data = JSON.parse(message.utf8Data);
        console.log(`Mensaje recibido: ${JSON.stringify(data)} de ${thisClient.id}`);

        // Derivar mensaje según nombre a función asociada
        if(typeof handlers[data.name] !== 'undefined') {
          const out = handlers[data.name](thisClient, data.value, clients);
          out.name = data.name;
          connection.send(JSON.stringify(out));
        } else {
          console.error(`Función ${data.name} indefinida.`);
        }
      }
    });

    // Registrar desconexión
    connection.on('close', function(connection) {
      const i = clients.indexOf(thisClient);
      const pizzeriaId = clients[i].pizzeriaId;
      clients.splice(i, 1);
      console.log(`Usuario desconectado, ${clients.length} activos.`);

      handlers.notifyConnected(clients);
    });
  });

}