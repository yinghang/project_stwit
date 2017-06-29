// Import dependencies
var express = require('express');
var router = express.Router();
var axios = require('axios');

// Import models
var User = require('../models').User;
var Ticker = require('../models').Ticker;


// Authentication route
router.post('/authenticate', function(req, res, next){

  // Find token in MongoDB
  User.findOne({
    token: req.body.token
  }).exec(function(err, user){

    // throw err if error
    if (err) throw err;

    // If no such user, create one
    if (!user) {
      var newUser = new User();
      newUser.token = req.body.token;
      newUser.save(function(err) {
        if (err) {
          if (err.code == 11000) 
            return res.json({ success: false, message: 'A user with that token already exists.'});
          else 
            return res.send(err);
        }
        // return a message if user creation successful
        res.json({ success: true, message: 'User created!' });
      });
    } 
    // return a message if token already in the DB
    else {
      res.json({success: true, message: 'User already in the system!'});
    }
  })
});

// Firewall - anything past this route requires a token
router.use(function(req, res, next) {
  console.log("Somebody is trying to access the restricted area!");

  // check for token in headers etc
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // find and validate token
  if (token) {
    User.findOne({
      token: token
    }).exec(function(err, user){
      if (err) throw err;

      if (!user) {
        res.status(403).send({ 
          success: false, 
          message: 'No token provided.' 
        });
      }

      else {
        next();
      }
    })
  }
});

// Sentiment search API - hits stocktwits & sentiment140
router.post('/search', function(req, res, next){
  // Grab token from header
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // Hit StockTwits api
  axios.get('https://api.stocktwits.com/api/2/streams/symbol/' + req.body.ticker + '.json')
  .then(function (response) {

    // Put results in array
    var arr = [];
    response.data.messages.forEach(function(msg){
      arr.push(
        {
          "text": msg.body
        }
      )
    });

    
    // Find tickers in db to prevent duplicates
    Ticker.findOne({
      ticker: req.body.ticker
    }).exec(function(err, ticker){

      //  Create ticker object if doesn't exist
      if (!ticker) {
        var newTicker = new Ticker();
        newTicker.ticker = req.body.ticker;
        newTicker.messages = arr;
        newTicker.save(function(err) {
          if (err) {
            console.log(err);
          }
        });
      } 
      
      // else merge the messages after searching for duplicates
      else {
        var old_array = ticker.messages;
        arr.forEach(function(i){
          var temp = old_array.filter(function(obj){
            return obj.text == i.text
          });
          if (temp.length <= 0) old_array.push(i);
        });
        ticker.messages = old_array;
        arr = old_array
        ticker.save(function(err) {
          if (err) console.log(err);
        });
      }

      // Hit Sentiment140 API with StockTwits data
      axios.post('http://www.sentiment140.com/api/bulkClassifyJson', {
        data: arr
      })
      .then(function (response) {
        var length = response.data.data.length;
        var sum = response.data.data.reduce(function(acc, obj){
          return acc + obj.polarity;
        }, 0)
        res.json({
          polarity: parseFloat(sum/length).toFixed(2)
        })
      })
      .catch(function (error) {
        console.log(error);
      });
    });
  })
  .catch(function (error) {
    console.log("IN ERROR!!!")
    console.log(error);
    res.json({
      error: "Ticker not found!"
    })
  });
});

module.exports = router;
