'use strict'
require('dotenv').config();

const UsersSchema = require('./User.schema.js');

const { Sequelize, DataTypes } = require('sequelize');


const DATABASE_URL = process.env.DATABASE_URL || 'sqlite:memory';

let sequelizeDB = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

let Users = UsersSchema(sequelizeDB, DataTypes);

module.exports = {
  sequelizeDB,
  Users
};