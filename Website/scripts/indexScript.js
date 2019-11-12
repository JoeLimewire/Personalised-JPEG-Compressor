window.onload =function(){
    var i = document.getElementsByClassName("image");

    initSocket();

    createTable();
    canvas()


}

function initSocket(){
  var sock = new WebSocket("ws://localhost:5001");
  var sock = new WebSocket("ws://scripts/socket.js");
  var sock = new WebSocket('ws://echo.websocket.org');
  sock.onopen = function(event){
    alert('Socket is connected');
    setTimeout(function(){
      sock.send("blabbermoon");
    },1000);
  }
  sock.onopen = function(event) {
    alert('something');
  };

  // Handle any errors that occur.
  sock.onerror = function(error) {
    console.log('WebSocket Error: ' + error);
  };


}

function createTable(){
  var table = document.getElementById("table");
  for(var i=0;i<8;i++){
    var row = table.insertRow(i);
    for(var j=0;j<8;j++){
      var cell = row.insertCell(0);
      //grab some value
      var ran = Math.floor(Math.random() * 128) + 1;
      cell.innerHTML = ran;
      cell.style.backgroundColor = "rgb("+ran*2+","+ran+","+ran*2+")";
    }
  }
}

function canvas(){

  var canvas = document.getElementById("preview");
  var ctx = canvas.getContext("2d");
  console.log(canvas);
  ctx.crossOrigin = "Anonymous";

  var img = new Image();
  img.src = "pencils.jpg";
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img,0,0,canvas.width,canvas.height);
  data = ctx.getImageData(0,0,canvas.width,canvas.height);

}
