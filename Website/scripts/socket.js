var express = require('express');
var app = express();
var server = app.listen(5001,function(){
  console.log("listening to port 5001");
});

//static files
app.use(express.static('../../Website'));


//var server = require('ws').Server;
//var s = new server({port: 5001});

// Show a connected message when the WebSocket is opened.

//var app = require('http').createServer(handler);
//var io = require('socket.io').listen(app);
//var fs = require('fs');
