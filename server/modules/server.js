/*
  Iniciar servidor HTTP
  Responde todos los requests con index.html (Vue History Mode)
*/
const http = require('http');
const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const history = require('connect-history-api-fallback');
const checkLogin = require('./auth');

module.exports = function(firebase) {

  const server = http.createServer(app);

  app.use(bodyParser.json());

  app.use((req, res, next) => {
    const env = process.env.NODE_ENV || 'development';
    if(env == 'production' && req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    return next();
  });

  app.use('/api/*', (req, res, next) => {
    res.append('Content-Type', 'application/json');
    res.append('Access-Control-Allow-Origin', 'http://192.168.1.101:8080');
    res.append('Access-Control-Allow-Headers', 'Authorization');
    return next();
  });

  app.get('/api/challenges', checkLogin, async (req, res) => {
    const ref = firebase.firestore().collection('challenges');
    
    try {
      const docs = await ref.get();
      
      const data = { 
        ok: true,
        challenges: docs.docs.map(d => { 
          const data = d.data();
          data.id = d.id;
          data.pizzerias = (data.pizzerias ? data.pizzerias.map(p => { return p.id; }) : []);
          return data;
        })
      };

      res.end(JSON.stringify(data));
    } catch {
      res.end(JSON.stringify({ok: false}));
    }
  });

  app.get('/api/challenges/:id', checkLogin, async (req, res) => {
    const ref = firebase.firestore().collection('challenges').doc(req.params.id);
    
    try {
      const doc = await ref.get();
      const data = doc.data();
      data.ok = true;

      const subitems = data.pizzerias.map(async (ref) => {
        const subdoc = await ref.get();
        const subdata = subdoc.data();
        subdata.id = ref.id;
        return subdata;
      });

      Promise.all(subitems).then((subitems) => {
        data.pizzerias = subitems;
        res.end(JSON.stringify(data));
      });
    } catch {
      res.end(JSON.stringify({ok: false}));
    }
  });

  app.get('/api/pizzerias/:id', checkLogin, async (req, res) => {
    const ref = firebase.firestore().collection('pizzerias').doc(req.params.id);
    
    try {
      const doc = await ref.get();
      const data = doc.data();
      data.ok = true;
      res.end(JSON.stringify(data));
    } catch {
      res.end(JSON.stringify({ok: false}));
    }
  });

  app.get('/api/pizzerias/:id/votos', checkLogin, async (req, res) => {
    const ref = firebase.firestore().collection('votos').where('pizzeriaId', '=', `pizzerias/${req.params.id}`);
    
    try {
      const doc = await ref.get();
      const data = { ok: true, votos: doc.docs.map(d => { return d.data(); })}
      data.votos = data.votos.map(d => {
        d.voto = (d.secreto ? null : d.voto);
        return d;
      });
      res.end(JSON.stringify(data));
    } catch {
      res.end(JSON.stringify({ok: false}));
    }
  });

  app.use(history({
    verbose: false
  }));

  app.use(express.static(__dirname + '/../../dist'));

  return server;

};