window.onload =function(){
    var i = document.getElementsByClassName("image");

    initSocket();

    //createTable();
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

  drawGrid(ctx);

  console.log(canvas);
  ctx.crossOrigin = "Anonymous";
  //get image
  var img = new Image();
  img.src = "pencils.jpg";
  canvas.width = img.width;
  canvas.height = img.height;



  //put image on canvas
  ctx.drawImage(img,0,0,canvas.width,canvas.height);
  imgdata = ctx.getImageData(0,0,canvas.width,canvas.height);
  console.log(imgdata);

  for(var i = 0; i < imgdata.data.length; i= i +2){
    //imgdata.data[i] = imgdata.data[i] -200;
  }
 //PUT IMAGE DATA ON CANVAS
  ctx.putImageData(imgdata,0,0);

  drawGrid(ctx);

  ctx.moveTo(20, 20);
  ctx.lineTo(40,40);


}

function drawGrid(ctx){
  var canvas = document.getElementById("preview");
  var width = canvas.width;
    var height = canvas.height;

    for (var x = 0; x <= width; x += 8) {
            ctx.moveTo( x, 0);
            ctx.lineTo( x, height);
            ctx.strokeStyle = "#FF0000";
            ctx.fillRect(x,y,1,1);
            ctx.strokeStyle = "#000000";


        for (var y = 0; y <= height; y += 8) {
            ctx.moveTo(0, y );
            ctx.lineTo(width,  y);

            ctx.strokeStyle = "#FF0000";
            ctx.fillRect(x,0,1,1);
            ctx.strokeStyle = "#000000";
        }
      }

      ctx.stroke();
}
