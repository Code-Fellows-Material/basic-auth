'use strict'

const express = require('express');
const UserRoutes = require('./routes/signUp.routes');

const errorHandler = require('./error-handlers/403');

// Prepare the express app
const app = express();

// Process JSON input and put the data on req.body
app.use(express.json());

// Process FORM input and put the data on req.body
app.use(express.urlencoded({ extended: true }));

app.use(UserRoutes);

app.use(errorHandler);

module.exports = {
  start: (port) => app.listen(port, () => console.log('server up')),
  app
}