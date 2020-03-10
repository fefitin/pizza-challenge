function Message(name, value) {
  return { name, value };
}

const socket = {
  socket: null,
  receiveHandlers: {},
  init: function() {
    let url;

    if (process.env.NODE_ENV == "development") {
      const port = process.env.VUE_APP_PIZZA_CHALLENGE_SERVER_PORT;
      url = `ws://192.168.1.101:${port}`;
    } else {
      url = 'wss://'+location.host;
    }

    socket.socket = new WebSocket(url);

    socket.socket.addEventListener("message", message => {
      message = JSON.parse(message.data);
      if(socket.receiveHandlers[message.name]) {
        const handler = socket.receiveHandlers[message.name];
        handler(message);
      }
    });
  
    return new Promise((resolve, reject) => {
      socket.socket.addEventListener("open", () => {
        resolve();
      });
    });
  },
  send(name, message) {
    const payload = new Message(name, message);
    socket.socket.send(JSON.stringify(payload));
  },
  receive(name, handler) {
    socket.receiveHandlers[name] = handler;
  },
  reset() {
    socket.send('setPizzeriaId', null);
  }
};
export default socket;
