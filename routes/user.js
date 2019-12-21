'use strict';

const express = require('express');
const passport = require('passport');
const { postRegister } = require('../controllers/user');

const router = express.Router();

router.post('/user/login',
  passport.authenticate('local'),
  async (req, res) => {
    let token = await req.user.issueJWT();
    return res.status(200).send({
      accessToken: token
    });
  }
);

router.post('/user/register', postRegister);

module.exports = router;