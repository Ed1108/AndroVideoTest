'use strict';
const _ = require('lodash');
const ObjectId = require('mongoose').Types.ObjectId; 
const Article = require('../models/article');

module.exports = {
  postArticle: async (req, res) => {
    try{
      let article = new Article(req.body);
      article.author = req.user.name;
      article.authorId = new ObjectId(req.user.id);
      await article.save();
      res.status(201).send({message: 'Article has been created success.'});
    }catch (err) {
      res.status(400).send(err); 
    }
      
  },

  getArticle: async (req, res) => {
    try{
      let condition = {
        sort: {createdAt: -1}
      };
      if (req.query.limit !== undefined) {
        condition.limit = Number(req.query.limit);
      }else {
        condition.limit = 100; 
      }
        
      if (req.query.offset !== undefined) {
        condition.skip = Number(req.query.offset);
      }
      let articles = await Article.find({}, null, condition);
      
      
      let result = [];
      _.forEach(articles, article => {
        let obj = {
          id: article._id,
          subject: article.subject,
          author: article.author,
          content: article.content
        };
        result.push(obj);
      });
      res.status(200).send({result: result});
    }catch(err) {
      res.status(400).send(err);
    }
    
  },

  updateArticle: async (req, res) => {
    if(!req.article) {
      return res.status(404).send({message: 'Invalid articleId.'});
    }

    if(req.article.authorId.toString() !== req.user.id) {
      return res.status(403).send({message: 'Permission denied.'});
    }

    if(req.body.subject) {
      req.article.subject = req.body.subject;
    }

    if(req.body.content) {
      req.article.content = req.body.content;
    }

    await req.article.save();
    res.status(200).send({message: 'Article has been updated success.'});
  },

  deleteArticle: async (req, res) => {
    if(!req.article) {
      return res.status(404).send({message: 'Invalid articleId.'});
    }
    if(req.article.authorId.toString() !== req.user.id) {
      return res.status(403).send({message: 'Permission denied.'});
    }

    await req.article.remove();
    res.status(200).send({message: 'Article has been deleted success.'});
  }
};