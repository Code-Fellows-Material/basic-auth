'use strict'
require('dotenv').config();
const bcrypt = require('bcrypt');

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

//Create a method in the schema to authenticate a user using the hashed password.
Users.validator = async (submittedPass, userPass) => {
  console.log('validator called')
  return await bcrypt.compare(submittedPass, userPass)
}


module.exports = {
  sequelizeDB,
  Users 
};