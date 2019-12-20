'use strict';


const User = require('../models/user');



module.exports = {
  postRegister: async (req, res) => {
    console.log(req.body);
    let user = new User(req.body);
    try{
      await user.save();
      res.status(201).send({message: 'User has be created success.'});
    }catch (err) {
      res.status(400).send(err); 
    }
    
  }
};