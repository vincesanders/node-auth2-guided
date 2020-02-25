const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const connectSessionKnexStore = require('connect-session-knex')(session);
const knex = require('../database/dbConfig');

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use(session({
  name: 'nameofcookie',
  secret: 'keep it secret, keep it safe',
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false, //true in production
    httpOnly: true //javascript code can't access
  },
  resave: false,
  saveUninitialized: false,
  store: new connectSessionKnexStore({
    knex: knex,
    tablename: 'sessions',
    createtable: true,
    sidfieldname: 'sid',
    clearInterval: 1000 * 60 * 15
  })
}));

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

module.exports = server;
