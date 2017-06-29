// ----------------------------------------------
// project_stwit models & schemas
// ----------------------------------------------

// ----------------------------------------------
// Import dependencies
// ----------------------------------------------
var mongoose = require('mongoose');

var connect = process.env.MONGODB_URI;
mongoose.connect(connect);

// ----------------------------------------------
// Log successful connection in console
// ----------------------------------------------
var db_connection = mongoose.connection;
db_connection.once('open', function callback () {
  console.log("DB Connected!");
});

// ----------------------------------------------
// User schema
// ----------------------------------------------
var userSchema = mongoose.Schema({
    token: {
        type: String,
        required: true
    }
});

// ----------------------------------------------
// Ticker schema
// ----------------------------------------------
var tickerSchema = mongoose.Schema({
    ticker: {
        type: String,
        required: true
    },
    messages: {
      required: true,
      type: [{
        text: String
      }]
    }
})

module.exports = {
  User: mongoose.model('User', userSchema),
  Ticker: mongoose.model('Ticker', tickerSchema)
};