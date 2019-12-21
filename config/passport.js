'use strict';

const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config  = require('../config/config');
const User = require('../models/user');


const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.JWT_TOKEN_SIGNING_KEY,
  issuer: config.jwt.JWT_TOKEN_ISSUER
};


module.exports = passport => {
  passport.use(new LocalStrategy(
    { 
      usernameField: 'account',
      passwordField: 'password'
    },
    async (account, password, done) => {
      try{
        let user = await User.findOne({ account: account });
        if(!user) {
          return done(null, false, {message: 'Unknown user'});
        }
        if (!user.authenticate(password)) {
          return done(null, false, {
            message: 'Invalid password'
          });
        }
        return done(null, user);
      }catch(err) {
        done(err);
      }
    }
  ));

  passport.use( new JwtStrategy(opts, (payload, done) => {
    let exp = payload.exp;
    let iat = payload.iat;
    const current = Math.ceil(new Date().getTime()/1000);
    if(current > exp || current < iat) {
      return done(null, false, 'Token Expired');
    }
    let user = {
      id: payload.id,
      name: payload.name,
      account: payload.sub
    };
    return done(null, user);
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser( (id, done) => {
    User.findOne({
      _id: id
    }, '-salt -hashed_password', (err, user) => {
      done(err, user);
    });
  });
};