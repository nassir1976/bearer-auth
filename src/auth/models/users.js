'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config()

// SETUP AN "APP SECRET" TO SIGN OUR TOKEN
const SECRET = process.env.SECRET || 'SECRET'; // APP LEVEL, NOT USER LEVEL

const users = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Adds a virtual field to the schema. We can see it, but it never persists
// So, on every user object ... this.token is now readable!
users.virtual('token').get(function () {
  
  let tokenObject = {
    username: this.username,
  }
  return jwt.sign(tokenObject,process.env.SECRET) // this will create a "token" for us, which includes our username and the app secret as a second layer of verification
});

// mongoose "pre" hook to run "before" the save method is called
users.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});
// meant to check a plain text password with a hashed one
// BASIC AUTH
users.statics.authenticateBasic = async function (username, password) {
  const user = await this.findOne({username:username})
  const valid = await bcrypt.compare(password, user.password)// checks the uncrackable password against a real one and returns -> true/false
  if (valid) { return user; }else{
  throw new Error('Invalid User');
}
}
// this is meant to find a user in the DB, given the username from the token
// that means that they are authorized into the route
// BEARER AUTH
users.statics.authenticateWithToken = async function (token) {
  try {
    const parsedToken = jwt.verify(token,process.env.SECRET);
    const user = this.findOne({ username: parsedToken.username })
    if (user) { 
      return {user:{_id:user._id,username:user.username},token:token }
    } 
    throw new Error("User Not Found");
  } catch (e) {
    throw new Error(e.message)
  }
}


module.exports = mongoose.model('users', users);
