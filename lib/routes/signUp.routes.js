'use strict'

const {signUpHandler, signInHandler} = require('../auth/signUp');
const express = require('express');
const router = express.Router();

router.post('/signup', signUpHandler, (req, res) => {
  res.status(201).json(req.body.record);
});

router.post('/signin', signInHandler, (req, res) => {
  res.status(200).json(req.body.user);
});

module.exports = router;