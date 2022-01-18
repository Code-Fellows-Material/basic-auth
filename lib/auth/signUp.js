'use strict'

// 3rd Party Resources
const bcrypt = require('bcrypt');
const base64 = require('base-64');

const {Users} = require('../models')

// automatically assign an encrypted password to our User. beforeCreate is a feature of sequelize models, takes a callback function
Users.beforeCreate(async user => {
  console.log("before Create called")
  user.password = await bcrypt.hash(user.password, 10);
});


// Signup Route -- create a new user
// Two ways to test this route with httpie
// echo '{"username":"john","password":"foo"}' | http post :3000/signup
// http post :3000/signup username=john password=foo
async function signUpHandler(req, res, next){
  try {
    req.body.record = await Users.create(req.body);
    next();
  } catch (e) { 
    next("Error Creating User"); 
  }
};



// Signin Route -- login with username and password
// test with httpie
// http post :3000/signin -a john:foo
async function signInHandler(req, res, next){

  /*
    req.headers.authorization is : "Basic sdkjdsljd="
    To get username and password from this, take the following steps:
      - Turn that string into an array by splitting on ' '
      - Pop off the last value
      - Decode that encoded string so it returns to user:pass
      - Split on ':' to turn it into an array
      - Pull username and password from that array
  */

  let basicHeaderParts = req.headers.authorization.split(' ');  // ['Basic', 'sdkjdsljd=']
  let encodedString = basicHeaderParts.pop();  // sdkjdsljd=
  let decodedString = base64.decode(encodedString); // "username:password"
  let [username, password] = decodedString.split(':'); // username, password

  /*
    Now that we finally have username and password, let's see if it's valid
    1. Find the user in the database by username
    2. Compare the plaintext password we now have against the encrypted password in the db
       - bcrypt does this by re-encrypting the plaintext password and comparing THAT
    3. Either we're valid or we throw an error
  */
  try {
    req.body.user = await Users.findOne({ where: { username: username } });
    const valid = await bcrypt.compare(password, req.body.user.password);
    if (valid) {
      next();
    }
    else {
      throw new Error('Invalid User')
    }
  } catch (error){ 
    next("Invalid Login");
  }
};

module.exports = {
  signUpHandler,
  signInHandler
}