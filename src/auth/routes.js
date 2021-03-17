'use strict';

const express = require('express');
const authRouter = express.Router();
const jwt = require('jsonwebtoken')
const User = require('./models/users.js'); // user models

const basicAuth = require('./middleware/basic.js')
const bearerAuth = require('./middleware/bearer.js');


authRouter.post('/signup', async (req, res, next) => { //req.body ===get the form
  try {
    let user = new User(req.body);
    const userRecord = await user.save(req.body);
    // console.log(userRecord)
    const token = jwt.sign(user.toJSON(),process.env.SECRET);
    const output = {

      user: userRecord,
      token:token
    };
    console.log(output)
    res.status(201).json(output);
  } catch (e) {
    next(e.message)
  }
});

authRouter.post('/signin', basicAuth, (req, res, next) => {
  const user = {
    user: req.user,
    token: req.user.token
  };
  res.status(200).json(user);
});

authRouter.get('/users', bearerAuth, async (req, res, next) => {
  const users = await   User.find({});
  const list = users.map(user => user.username);
  res.status(200).json(list);

});

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  res.status(200).send("Welcome to the secret area!")
});


module.exports = authRouter;

