'use strict';

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const config = require('./config/config');
const userRoutes = require('./routes/user');
const articleRoutes = require('./routes/article');

let app = express();
app.use(bodyParser.json());


mongoose.connect(config.dbUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', err => {
  console.log(err);
});

db.once('open', () => {
  app.emit('dbOpen');
  console.log(`Connected to ${config.dbUrl}`);
});

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(userRoutes);
app.use(articleRoutes);

app.use('/static', express.static('public'));

app.server = app.listen(config.port, () => {
  console.log(config.welcome);
});

module.exports = app;