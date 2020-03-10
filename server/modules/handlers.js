/*
	Funciones para procesar mensajes
	recibidos via WebSocket
*/
const handlers = {
	setPizzeriaId(client, value, clients) {
		client.pizzeriaId = value;

		//Notificar conexiones a todos los clientes
		handlers.notifyConnected(clients);
		
		return { value: true };
	},
	notifyConnected(clients) {
		clients.forEach(client => {
			const connected = clients.filter(c => { return c.pizzeriaId == client.pizzeriaId });
			connected.forEach(c => {
				c.connection.send(JSON.stringify({ name: 'connected', value: connected.length }));
			});
		});
	},
	getVotoSecreto(client, value, clients) {
		//Buscar voto secreto
		const secreto = clients.filter((c) => {
			return c.secreto;
		});
		
		if(secreto.length) {
			return { value: (secreto[0] == client) };
		} else {

			//Asignar voto secreto aleatoriamente
			const min = 0;
			const max = clients.length - 1;
			const random = Math.floor(Math.random()*(max-min+1)+min);

			clients[random].secreto = true;
			return { value: clients[random] == client };
		}
	},
	notificarVoto(client, value, clients) {
		clients.forEach(c => { c.connection.send(JSON.stringify({ name: 'actualizarVotos' })); });
		return {};
	}
};

module.exports = handlers;