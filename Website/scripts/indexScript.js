window.onload =function(){
    var i = document.getElementsByClassName("image");

    initSocket();
    //createTable();
    var data = getImgData();
    rgbToYCbCr(data);

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

function getImgData(){

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
  //console.log(imgdata);


  for(var i = 0; i < imgdata.data.length; i= i +2){
    //imgdata.data[i] = imgdata.data[i] -200;
  }
 //PUT IMAGE DATA ON CANVAS
  ctx.putImageData(imgdata,0,0);


  //Function to draw a 8x8 grid over the canvas
  //drawGrid(ctx);

  ctx.moveTo(20, 20);
  ctx.lineTo(40,40);

  return imgdata;

}

function rgbToYCbCr(data){

  /*
  Grabs values of the image off of the CANVAS
  Each pixel has 4 values (RGBA)
  data[0] = R
  data[1] = G
  data[2] = B
  data[3] = A
  etc...

  https://sistenix.com/rgb2ycbcr.html
  */

  var arr = new Array();

  for(var i = 0; i < imgdata.data.length; i = i + 4){
    //RGB values are the same
    var r = data[i];
    var g = data[i+1];
    var b = data[i+2];

    var Y = 16 + (65.738*r)/256 + (129.057*g)/256 + (25.064*b)/256;
    var Cb = 128 - (37.945*r)/256 + (74.494*g)/256 + (112.439*b)/256;
    var Cr = 128 + (112.439*r)/256 + (94.154*g)/256 + (18.285*b)/256;

    //change float to int
    arr[i,0] = parseInt(Y);
    arr[i,1] = Cb;
    arr[i,2] = Cr;

    data[i] = Math.floor(Y);
    data[i+1] = parseInt(Cb);
    data[i+2] = parseInt(Cr);

  }
  console.log(arr[0,0]);
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
