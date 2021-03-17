'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config()

// SETUP AN "APP SECRET" TO SIGN OUR TOKEN
const SECRET = process.env.SECRET || 'secret'; // APP LEVEL, NOT USER LEVEL


  const users = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    
    password: { type: String, required: true }
  }, 
  { toJSON: { virtuals: true } });

  // mongoose "pre" hook to run "before" the save method is called
  users.pre('save', async function () {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  });


// Adds a virtual field to the schema. We can see it, but it never persists
// So, on every user object ... this.token is now readable!
// fack table system
users.virtual('token').get(function () {
  
  let token = {
    username: this.username,
  }
  return jwt.sign(token,process.env.SECRET) // this will create a "token" for us, which includes our username and the app secret as a second layer of verification
});

// meant to check a plain text password with a hashed one
// BASIC AUTH
users.statics.authenticateBasic = async function (username, password) {
  const user = await this.findOne({username:username})
  const valid = await bcrypt.compare(password, user.password)// checks the uncrackable password against a real one and returns -> true/false
  if (valid) { return user; }
  throw new Error('Invalid User');
}

// this is meant to find a user in the DB, given the username from the token
// that means that they are authorized into the route
// BEARER AUTH
users.statics.authenticateWithToken = async function (token) {
  
    const parsedToken = await jwt.verify(token,process.env.SECRET);
    const user = await this.findOne({ username: parsedToken.username })
    if (user) { return user;}
    
    throw new Error('INVALID TOKEN')
  } 


module.exports = mongoose.model('users', users);