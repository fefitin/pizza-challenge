import axios from 'axios';
import { firebase } from '@firebase/app';
import '@firebase/auth';

const api = {
  host: function() {
    let url;

    if (process.env.NODE_ENV == "development") {
      const port = process.env.VUE_APP_PIZZA_CHALLENGE_SERVER_PORT;
      url = `http://192.168.1.101:${port}/api`;
    } else {
      url = `https://${location.host}/api`;
    }

    return url;
  },
  get: async function(url) {
    const token = await firebase.auth().currentUser.getIdToken();
    
    return new Promise((res, rej) => {
      axios.get(`${api.host()}/${url}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(data => {
        res(data.data);
      }).catch(rej);
    })
  }
}

export default api;