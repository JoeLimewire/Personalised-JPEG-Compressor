var express = require('express');
var connect = require('connect');
var app = express();
var server = app.listen(5001,function(){
  console.log("listening to port 5001");
});

//static files
app.use(express.static('../Website'));
