const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Use body-parser middleware to parse incoming request bodies
  server.use(bodyParser.urlencoded());

  server.post('/login', (req, res) => {
    const { username, password } = req.body;

    // console.log('username', username);
    // console.log('password', password);

    

    if(username === 'admin' && password === 'admin') {
      console.log('login success');
      res.redirect('/user');
    }
    else {
      console.log('login failed');
      res.redirect('/login');
    }

    res.end();
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(5000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:5000');
  });
});