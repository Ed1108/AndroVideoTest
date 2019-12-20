'use strict';

const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

module.exports = passport => {
  passport.use(new LocalStrategy(
    { 
      usernameField: 'email', 
      passwordField: 'password', 
      passReqToCallback: true 
    },
    async (req, email, password, done) => {
      try{
        let user = await User.findOne({ email: email });
        if(!user) {
          return done(null, false, {message: 'Unknown user'});
        }
        if (!user.authenticate(password)) {
          return done(null, false, {
            message: 'Invalid password'
          });
        }
        req.user = user;
        return done(null, user);
      }catch(err) {
        done(err);
      }
    }
  ));

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