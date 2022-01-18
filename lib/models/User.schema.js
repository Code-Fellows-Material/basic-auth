'use strict'

const bcrypt = require('bcrypt');

// Create a Sequelize model
const UsersSchema = (sequelize, DataTypes) => sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }},
  {
    hooks: {
      // automatically assign an encrypted password to our User. beforeCreate is a feature of sequelize models, takes a callback function
      beforeCreate: async (user)  => {
        console.log("before Create called")
        user.password = await bcrypt.hash(user.password, 10);
      },
    }  
  }
  );

module.exports = UsersSchema;
