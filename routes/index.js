var express = require('express');
var router = express.Router();

var bcrypt = require('bcrypt');
const saltRounds = 12;

var User = require('../models/user');
var config = require('../config');
var auth = require('../auth.js')();

var jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('You\'re in the api');
});

router.post('/register', function(req, res) {

    User.findOne({
      username: req.body.username
    }, function(err, username) {
      if (err) throw err;
      if (username){
        console.log('User found');
        res.json({
          status: false,
          msg : 'Username already exists!'
        });
      } else {
        // password hashing
        // bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
          var newusr = new User({
            username: req.body.username,
            email: req.body.email,
            password: ''
          });


          newusr.save(function(err, usr) {
            if (err) {

              if (err.name === 'BulkWriteError' && err.code === 11000) {
                console.log('email must be unique');
                res.json({
                  status: false,
                  msg: 'Email already taken!'
                });
              }
            } else{

                // console.log(usr);
                User.findById(usr.id, function(err, user) {
                  if (err) throw err;
                  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                    user.password = hash;
                    user.save(function(err, updatedusr){
                      if(err) throw err;
                      // console.log(updatedusr);
                    })
                  });
                });

                console.log('User successfully saved');
                res.json({
                  status: true,
                  msg: 'Registration sucessfull!'
                });
              }



            // console.log('User successfully saved');
            // res.json({
            //   status: true,
            //   msg: 'Registration sucessfull!'
            // });
          });
        // });
      }
    });

    // console.log(req.body.password);
    // res.json({message : 'Success'})

});

// router.post('/login', function(req, res){
//
// console.log(req.body)
//   User.findOne({
//     username: req.body.username
//   }, function(err, user){
//
//     if (err) throw err;
//
//     if (!user){
//       res.json({
//         status: false,
//         msg: 'Incorrect username or password!'
//       });
//     } else {
//       bcrypt.compare(req.body.password, user.password, function(err, res) {
//         if (res == true){
//           res.json({ something: true });
//         } else {
//           res.json({ something: false });
//         }
//       });
//       }
//     })
// });

router.post('/login', function(req, res) {
    User.findOne({
      username: req.body.username
    }, function(err, user) {

      if (err) throw err;

      if(!user){
        res.json({
          status: false,
          msg: 'Incorrect username or password!'
        })
      } else {
        bcrypt.compare(req.body.password, user.password, function(err, ok) {
          if(ok === true) {

            //
            //  TODO: MAKE AUTHENTICATION TOKEN SYSTEM
            //

            var payload = {
              id: user.id,
              username: user.username
            };

            var token = jwt.sign(payload, config.jwtSecret, {expiresIn: '1m'});

            res.json({
              status: true,
              msg: 'Successfully authenticated',
              token: token
            })
          } else {
            res.json({
              status: false,
              msg: 'Incorrect username or password!'
            })
          }
        });
      }

    })
})

router.get('/batata', auth.authenticate(), function(req, res) {
  res.send(req.user);
})

module.exports = router;
