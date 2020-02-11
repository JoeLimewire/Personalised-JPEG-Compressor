var express = require('express');
var connect = require('connect');
var app = express();
var server = app.listen(5001, function() {
    console.log("listening to port 5001");
});

//static files
app.use(express.static('public'));

var dct = require('dct'),
    signal = [1, 1, 1, 1, 1];

var coef = dct(signal);

console.log(coef); // [12, 0, 0, 0, 0]