'use strict';

const { start } = require("./lib/server.js");
const {sequelizeDB} = require('./lib/models');

const PORT = process.env.PORT || 3000;

// make sure our tables are created, start up the HTTP server.
sequelizeDB.sync()
  .then(() => {
    start(PORT);
  }).catch(e => {
    console.error('Could not start server', e.message);
  });
