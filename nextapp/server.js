const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

//Database
const Sequelize = require('sequelize');

const sequelize = new Sequelize('users', 'user', 'Web_acc825', {
  host: 'localhost',
  dialect: 'mysql'
});

const User = sequelize.define('user', {
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  browsingData: Sequelize.JSON
});

//sequelize.sync()

const cookieParser = require('cookie-parser');

app.prepare().then(() => {
  const server = express();

  // Use body-parser middleware to parse incoming request bodies
  server.use(bodyParser.urlencoded());
  server.use(bodyParser.json());


  server.use(cookieParser());

  //Used to login a user and redirect to user page
  server.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ where: { username, password } });
      if (user) {
        console.log('login success');
        res.cookie('user', JSON.stringify(user.username));
        res.cookie('browsingData', JSON.stringify(user.browsingData));
        res.redirect('/user');
      } else {
        console.log('login failed');
        res.redirect('/login');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).send('An error occurred');
    }
    
});

  //Used to create a new user
  server.post('/register', async (req, res) => {
    //browswer data is a JSON object, which will be NULL on registration
    const { username, password } = req.body;

    try {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        console.log('Username already taken');
        return res.status(400).json({ message: 'Username already taken' });
      }
      let browsingData = {};
      const newUser = await User.create({ username, password, browsingData });
      console.log('User created:', newUser.toJSON());
      res.redirect('/user');
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).send('An error occurred');
    }
  });

  //Used to send data from the browser extension to the server
  //Don't ever 'login' just check username and password every time data is sent
  server.post('/newData', async (req, res) => {
    const { username, password, browsingData } = req.body;
    try {
      const user = await User.findOne({ where: { username, password } });
      if (user) {
        console.log('Adding new data');
        user.browsingData = browsingData;
        await user.save();
      } else {
        console.log('User not found');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).send('An error occurred');
    }
  });


  server.get('/globalData', async (req, res) => {

    try {
      const users = await User.findAll({attributes: ['browsingData']});

      const nodes = [];
      const links = [];
      
      for (const user of users) {

	const nodesArray = user.dataValues.browsingData.nodesArray;
	const linksArray = user.dataValues.browsingData.linksArray;

	console.log(nodesArray, linksArray);
	nodesArray.map(node => nodes.push(node));
	linksArray.map(link => links.push(link));
      }
      
      res.send({nodesArray: nodes, linksArray: links})

    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).send('An error occurred');
    }

  })
  
  server.get('/userData', async (req, res) => {


    const username = req.query.user.replace(/"+/g, '');

    try {
      const user = await User.findOne({ where: { username: username}})
      if (user) {
	res.send(user.browsingData);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).send('An error occurred');
    }

  })


  
  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(5000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:5000');
  });
});
