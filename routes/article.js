'use strict';

const express = require('express');
const passport = require('passport');
const Article = require('../models/article');
const { postArticle,  getArticle, updateArticle, deleteArticle} = require('../controllers/article');

const router = express.Router();

router.post('/article', 
  passport.authenticate('jwt'),
  postArticle
);

router.get('/article', getArticle);


router.put('/article/:articleId',
  passport.authenticate('jwt'),
  updateArticle
);

router.patch('/article/:articleId',
  passport.authenticate('jwt'),
  updateArticle
);

router.delete('/article/:articleId',
  passport.authenticate('jwt'),
  deleteArticle
);

router.param('articleId', async (req, res, next, id) => {
  try{
    let article = await Article.findOne({_id: id});
    req.article = article;
    next();
  }catch(err) {
    next(err);
  }
});

module.exports = router;