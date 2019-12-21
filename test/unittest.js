'use strict';

const request = require('supertest');
const expect = require('chai').expect;
const User = require('../models/user');
const Article = require('../models/article');
const URL = 'http://127.0.0.1:3000';

const USER_1 = {
  account: 'user1@test.com',
  password: '1234',
  name: 'user1'
};
const USER_2 = {
  account: 'user2@test.com',
  password: '1234',
  name: 'user2'
};

let app;

let user1Token;
let user2Token;

let user1ArticleId;
let user2ArticleId;



describe('Unit test', () => {
  before(done => {
    app = require('../app');
    app.on('dbOpen', () =>{
      done();
    });
  });

  it('User 1 Register', done => {
    let param = USER_1;

    request.agent(URL)
      .post('/user/register')
      .set('Content-Type', 'application/json')
      .send(param)
      .end((err, res) =>{
        expect(res.status).to.equal(201);
        done();
      });
  });

  it('User 1 Register againt, should get 400', done =>  {
    let param = USER_1;

    request.agent(URL)
      .post('/user/register')
      .set('Content-Type', 'application/json')
      .send(param)
      .end((err, res) =>{
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('User 2 Register', done => {
    let param = USER_2;

    request.agent(URL)
      .post('/user/register')
      .set('Content-Type', 'application/json')
      .send(param)
      .end((err, res) =>{
        expect(res.status).to.equal(201);
        done();
      });
  });

  it('User 1 login', done => {
    let param = USER_1;

    request.agent(URL)
      .post('/user/login')
      .set('Content-Type', 'application/json')
      .send(param)
      .end((err, res) =>{
        expect(res.status).to.equal(200);
        user1Token = res.body.accessToken;
        done();
      });
  });

  it('User 1 post article', done => {
    let param = {
      subject: 'subject of article 1',
      content: 'content of article 1'
    };

    request.agent(URL)
      .post('/article')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + user1Token)
      .send(param)
      .end((err, res) =>{
        expect(res.status).to.equal(201);
        done();
      });
  });

  it('Check created article', done => {
    request.agent(URL)
      .get('/article')
      .end((err, res) =>{
        expect(res.status).to.equal(200);
        expect(res.body.result[0].subject).to.equal('subject of article 1');
        user1ArticleId = res.body.result[0].id;
        done();
      });
  });

  it('User 1 update article', done => {
    let param = {
      subject: 'subject of article 1',
      content: 'updated content'
    };

    request.agent(URL)
      .patch('/article/' + user1ArticleId)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + user1Token)
      .send(param)
      .end((err, res) =>{
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('Check updated article', done => {
    request.agent(URL)
      .get('/article?=' + user1ArticleId)
      .end((err, res) =>{
        expect(res.status).to.equal(200);
        expect(res.body.result[0].content).to.equal('updated content');
        user1ArticleId = res.body.result[0].id;
        done();
      });
  });

  it('User 2 login', done => {
    let param = USER_2;

    request.agent(URL)
      .post('/user/login')
      .set('Content-Type', 'application/json')
      .send(param)
      .end((err, res) =>{
        expect(res.status).to.equal(200);
        user2Token = res.body.accessToken;
        done();
      });
  });

  it('User 2 post article', done => {
    let param = {
      subject: 'subject of article 2',
      content: 'content of article 2'
    };

    request.agent(URL)
      .post('/article')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + user2Token)
      .send(param)
      .end((err, res) =>{
        expect(res.status).to.equal(201);
        done();
      });
  });

  it('Check length of article list, should be 2', done => {
    request.agent(URL)
      .get('/article')
      .end((err, res) =>{
        expect(res.status).to.equal(200);
        expect(res.body.result.length).to.equal(2);
        user2ArticleId = res.body.result[0].id;
        done();
      });
  });

  it('User 2 update article of user 1, should get 403', done => {
    let param = {
      subject: 'subject of article 2',
      content: 'updated content'
    };

    request.agent(URL)
      .patch('/article/' + user1ArticleId)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + user2Token)
      .send(param)
      .end((err, res) =>{
        expect(res.status).to.equal(403);
        done();
      });
  });

  it('User 2 delete article of himself', done => {

    request.agent(URL)
      .delete('/article/' + user2ArticleId)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + user2Token)
      .end((err, res) =>{
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('Check length of article list, should be 1', done => {
    request.agent(URL)
      .get('/article')
      .end((err, res) =>{
        expect(res.status).to.equal(200);
        expect(res.body.result.length).to.equal(1);
        done();
      });
  });

  after( done => {
    let clearUser = () => {
      return User.deleteMany({});
    };

    let clearArticle = () => {
      return Article.deleteMany({});
    };


    clearUser()
      .then(clearArticle)
      .then(() =>{
        app.server.close();
        done();
      }).catch(err => console.log(err));

    
    
  });

});
