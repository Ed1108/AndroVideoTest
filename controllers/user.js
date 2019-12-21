'use strict';


const User = require('../models/user');



module.exports = {
  postRegister: async (req, res) => {
    let user;
    if(req.body.account) {
      user = await User.findOne({account: req.body.account});
      if(user) {
        return res.status(400).send({message: 'Account already exists.'});
      }
    }

    user = new User(req.body);
    try{
      await user.save();
      res.status(201).send({message: 'User has been created success.'});
    }catch (err) {
      res.status(400).send(err); 
    }
    
  }
};