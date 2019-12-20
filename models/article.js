'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema(
  {
    subject: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

ArticleSchema.index({ authorId: 1 });

module.exports = mongoose.model('Article', ArticleSchema);