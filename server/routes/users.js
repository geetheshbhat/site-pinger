var express = require('express');
var router = express.Router();
var db = require('./../services/db.service')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');


/* GET users listing. */
router.post('/login', async function (req, res, next) {
  let { email, password } = req.body
  try{
  if (!email || !password) {
    return res.status(400).send({
      'Message': 'Bad Request'
    })
  }
  else if (password.length < 8) {
    return res.status(400).send({
      'Message': 'Password length is incorrect'
    })
  }
  else if (await db.getUser(email).length === 0) {
    return res.status(404).send({
      'Message': 'User Does Not Exist'
    })
  }
  else{
      let resp = await db.getUser(email)
      let resResult
      await bcrypt.compare(password, resp.password, async function(err, result) {
        if (result===true){
          let token=jwt.sign({
            email: resp.email
          },'secretkey',{
            expiresIn: '60d'
          })
          await db.saveToken(resp.id, token)
          return res.status(200).send({
            'key':token,
            'status': true
          })
        }
        else{
          res.send('error')
        }
    });
    
  }
}
catch{
  res.status(500).send('Server Error')
}
});
router.post('/signup', async function (req, res, next) {
  let { email, password } = req.body
  if (!email || !password) {
    return res.status(400).send({
      'Message': 'Bad Request'
    })
  }
  else if (password.length < 8) {
    return res.status(400).send({
      'Message': 'Password length is incorrect'
    })
  }
  else if (await db.getUser(email).length === 0) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        db.createUser(email, hash)
      });
    });
    return res.status(200).send({
      'Message': 'User added successfully'
    })
  }
  else {
    return res.status(400).send({
      'Message': 'Email Exists'
    })
  }
});

module.exports = router;
