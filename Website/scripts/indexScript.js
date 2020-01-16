//https://arxiv.org/ftp/arxiv/papers/1405/1405.6147.pdf

var w,h;
//MAIN--------------------------------------------------------------------------------
window.onload = function(){
    var i = document.getElementsByClassName("image");

    initSocket();
    createTable();

    //'data' contains all the pixel information of the image
    var data = getImgData();
    console.log(data);
    //RGB to YCbCr Conversion
    data = rgbToYCbCr(data);

    //DATA NO LONGER CONTAINS ALPHA VALUE
    console.log(data);
    //Split Data into 8x8 Blocks
    var sData = splitData(data);


}
//--------------------------------------------------------------------------------
function initSocket(){
  //var sock = new WebSocket("ws://localhost:5001");
  //var sock = new WebSocket("ws://scripts/socket.js");
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
//--------------------------------------------------------------------------------
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
//--------------------------------------------------------------------------------
function getImgData(){

  var canvas = document.getElementById("preview");
  var ctx = canvas.getContext("2d");
  ctx.crossOrigin = "Anonymous";

  drawGrid(ctx);

  console.log(canvas);

  //get image
  var img = new Image();
  img.src = "tiger.jpg";
  w = img.width;
  h = img.height;
  canvas.width = img.width;
  canvas.height = img.height;

  //put image on canvas
  ctx.drawImage(img,0,0,canvas.width,canvas.height);
  imgdata = ctx.getImageData(0,0,canvas.width,canvas.height);
  //console.log(imgdata);

  //console.log(img.height);

  for(var i = 0; i < imgdata.data.length; i= i +2){
    //imgdata.data[i] = imgdata.data[i] -200;
  }
 //PUT IMAGE DATA ON CANVAS
  ctx.putImageData(imgdata,0,0);


  //Function to draw a 8x8 grid over the canvas
  drawGrid(ctx);

  ctx.moveTo(20, 20);
  ctx.lineTo(40,40);


  return imgdata;

}
//--------------------------------------------------------------------------------
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

  for(var i = 0; i < imgdata.data.length; i = i + 3){
    //RGB values are the same
    var r = imgdata.data[i];
    var g = imgdata.data[i+1];
    var b = imgdata.data[i+2];

    var Y = 16 + (65.738*r)/256 + (129.057*g)/256 + (25.064*b)/256;
    var Cb = 128 - (37.945*r)/256 + (74.494*g)/256 + (112.439*b)/256;
    var Cr = 128 + (112.439*r)/256 + (94.154*g)/256 + (18.285*b)/256;

    //shift from range(0-255) to (-128-127)
    arr[i] = Y - 128;
    arr[i+1] = Cb - 128;
    arr[i+2] = Cr - 128;

  }

  return arr;
}
//--------------------------------------------------------------------------------
function splitData(data){

  //how many blocks horizontally
  bw = w/8;
  //how many blocks horizontally
  bh = h/8;
  var offset = 0;

  console.log("DEBUG: WIDTH: " + w + " HEIGHT: " + h);
  console.log("DEBUG: BLOCK-WIDTH: " + bw + " BLOCK-HEIGHT: " + bh);


  //Array of blocks on WIDTH
  var splitData = new Array(bw);
  for(var i = 0; i < bw; i++){
    //Array of blocks on HEIGHT
    splitData[i] = new Array(bh);
    for(var j = 0; j < bh; j++){
      //Array of Pixels in each block
      splitData[i][j] = new Array(64);
      offset = offset+j;
      for(var k = 0; k < 64; k++){
        //RGB data for each pixel
        splitData[i][j][k] = new Array(4);
        /*
        splitData[i][j][k][0] = i+j+k+offset;
        splitData[i][j][k][1] = i+j+k+1+offset;
        splitData[i][j][k][2] = i+j+k+2+offset;
        splitData[i][j][k][3] = i+j+k+3+offset;

        */
        splitData[i][j][k][0] = data[i+j+k+offset];
        splitData[i][j][k][1] = data[i+j+k+1+offset];
        splitData[i][j][k][2] = data[i+j+k+2+offset];
        splitData[i][j][k][3] = data[i+j+k+3+offset];

        offset = offset + 3;
      }
      offset = offset + 62 - j;
    }
    offset = offset + 119;
  }

  console.log(splitData);

  return splitData;

}
//--------------------------------------------------------------------------------
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
