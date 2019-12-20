'use strict';

const express = require('express');
const passport = require('passport');
const { postArticle,  getArticle} = require('../controllers/article');

const router = express.Router();

router.post('/article', 
  passport.authenticate('jwt', {
    failureFlash: false, 
    failWithError: true
  }), 
  postArticle
);

router.get('/article', getArticle);

module.exports = router;