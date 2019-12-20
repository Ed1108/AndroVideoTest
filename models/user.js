'use strict';

const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt  = require('jsonwebtoken');
const Schema = mongoose.Schema;
const config  = require('../config/config');

let secretKey = config.jwt.JWT_TOKEN_SIGNING_KEY;
let algorithm = config.jwt.JWT_ALGORITHM;
let issuer = config.jwt.JWT_TOKEN_ISSUER;
let exp = config.jwt.JWT_TOKEN_EXPIRATION_TIME;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  account: {
    type: String,
    required: true
  },
  hashed_password: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
});

UserSchema.methods.makeSalt = function() {
  return crypto.randomBytes(16).toString('base64');
};

UserSchema.methods.hashPassword = function(password) {
  if (!password || !this.salt) return '';
  var salt = Buffer.from(this.salt, 'base64');
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64');
};

UserSchema.methods.authenticate = function(plainText) {
  return this.hashPassword(plainText) === this.hashed_password;
};

UserSchema.methods.issueJWT = async function() {
  let now = Math.ceil(new Date().getTime()/1000);
  let user = {
    sub: this.account,
    id: this._id,
    name: this.name,
    iss: issuer,
    iat: now,
    exp: now + exp  
  };
  let accessToken = await jwt.sign(user, secretKey, { algorithm: algorithm });
  return accessToken;
};

/**
 * Virtuals
 */
UserSchema.virtual('password').set( function(password) {
  this.salt = this.makeSalt();
  this.hashed_password = this.hashPassword(password);
});

UserSchema.index({ account: 1 });

module.exports = mongoose.model('User', UserSchema);