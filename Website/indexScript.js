//https://arxiv.org/ftp/arxiv/papers/1405/1405.6147.pdf
//https://www.math.cuhk.edu.hk/~lmlui/dct.pdf

const T = [
  [.3536,.3536,.3536,.3536,.3536,.3536,.3536,.3536],
  [.4904,.4157,.2778,.0975,-.0975,-.2778,-.4157,-.4904],
  [.4619,.1913,-.1913,-.4619,-.4619,-.1913,.1913,.4619],
  [.4157,-.0975,-.4904,-.2778,.2778,.4904,.0975,-.4157],
  [.3536,-.3536,-.3536,.3536,.3536,-.3536,-.3536,.3536],
  [.2778,-.4904,.0975,.4157,-4757,-.0975,.4904,-.2778],
  [.1913,-.4619,.4619,-.1913,-.1913,.4619,-.4619,.1913],
  [.0975,-.2778,.4157,-.4904,.4904,-.4157,.2778,-.0975]
]

var w,h;
var sData;
var img = new Image();

//MAIN--------------------------------------------------------------------------------
window.onload = function(){
    var i = document.getElementsByClassName("image");

    initSocket();


    //'data' contains all the pixel information of the image
    var data = getImgData();
    console.log(data);
    //RGB to YCbCr Conversion
    data = rgbToYCbCr(data);

    //DATA NO LONGER CONTAINS ALPHA VALUE
    console.log(data);

    //Split Data into 8x8 Blocks
    //sData is a 4 dimentional Array
    //sData'[width][height]'<- Blocks '[pixel][RGBA]' <- Pixels and values
    sData = splitData(data);



    createTable();
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
function createTable(x,y){
  var table = document.getElementById("table");
  table.innerHTML="";
  for(var j=0;j<8;j++){
    var row = table.insertRow(i);
    for(var i=7;i>=0;i--){
      var cell = row.insertCell(0);
      //grab some value
      var ran = Math.floor(Math.random() * 128) + 1;
      var z = j*8+i;
      var color = Math.floor(sData[x][y][z][0]);

      cell.innerHTML = color;
      cell.style.backgroundColor = "rgb("+color+128+","+color+127+","+color+127+")";

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
  img.src = "tiger0.jpg";
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

  for(var i = 0; i < imgdata.data.length; i = i + 4){
    //RGB values are the same
    var r = imgdata.data[i];
    var g = imgdata.data[i+1];
    var b = imgdata.data[i+2];
    var a = imgdata.data[i+3];

    var Y = 16 + (65.738*r)/256 + (129.057*g)/256 + (25.064*b)/256;
    var Cb = 128 - (37.945*r)/256 + (74.494*g)/256 + (112.439*b)/256;
    var Cr = 128 + (112.439*r)/256 + (94.154*g)/256 + (18.285*b)/256;

    //shift from range(0-255) to (-128-127)
    arr[i] = Y - 128;
    arr[i+1] = Cb - 128;
    arr[i+2] = Cr - 128;
    arr[i+3] = 0;

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

  var splitData = new Array(bw);
  for (var col=0;col<bw;col++){
    splitData[col] = new Array(bh);
    for (var row = 0; row < bh ; row++) {
      splitData[col][row] = new Array(64);
      for (var pixel = 0 ; pixel < 64; pixel ++){
        splitData[col][row][pixel] = new Array(4);

        splitData[col][row][pixel][0] = 0;
        splitData[col][row][pixel][1] = 0;
        splitData[col][row][pixel][2] = 0;
        splitData[col][row][pixel][3] = 0;

      }
    }
  }

  //console.log(splitData);

  for(var val = 0;val<data.length;val+=4){
    //p is the value of pixel over image
    var p = val/4;
    // x is position of p
    var x = p%w;
    // y is position of p
    var y = Math.floor(p/w);

    //cell identifier COLUMN
    var i = Math.floor(x/8);
    //cell identifier ROW
    var j = Math.floor(y/8);

    var pixel =  x%8 + (y%8*8);

    //console.log("DEBUG: I: " + i + " J : " + j + " Pixel: " + pixel);
    //console.log("DEBUG: X: " + x + " Y : " + y + " P: " + p);

    splitData[i][j][pixel][0] = data[val];
    splitData[i][j][pixel][1] = data[val+1];
    splitData[i][j][pixel][2] = data[val+2];
    splitData[i][j][pixel][3] = data[val+3];




  }

  console.log(splitData);


/*
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
        splitData[i][j][k][0] = data[(i*8)+(j*8*bw)+k+offset];
        splitData[i][j][k][1] = data[i+j+k+1+offset];
        splitData[i][j][k][2] = data[i+j+k+2+offset];
        splitData[i][j][k][3] = data[i+j+k+3+offset];

        if((k+1)%8==0) {
          //end of row
          offset = offset +
        }
        offset = offset + 3;
      }
      offset = offset + 62 - j;
    }
    offset = offset + 119;
  }
  */

  //console.log(splitData);

  return splitData;

}
//--------------------------------------------------------------------------------
function drawGrid(ctx){
  var canvas = document.getElementById("preview");
  var width = canvas.width;
    var height = canvas.height;

      function highlightCell(i,j){
        i = Math.round(i);
        j = Math.round(j);
        var x = Math.floor(i/8);
        var y = Math.floor(j/8);

        ctx.drawImage(img,0,0,canvas.width,canvas.height);
        ctx.fillStyle = 'rgba(0, 255, 0, 0.40)';
        ctx.fillRect(x*8,y*8,8,8);

        createTable(x,y);

      }

      function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
        scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

        return {
          x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
          y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
        }
      }

      canvas.addEventListener('mousemove', function(evt) {
        //console.log("Something");
        var pos = getMousePos(canvas, evt);
        //console.log(pos);
        highlightCell(pos.x,pos.y);
      }, false);
      canvas.addEventListener('click',function(evt){
        var mousePos = getMousePos(canvas, evt);
        var message = 'Mouse position: ' + Math.round(mousePos.x /8)+ ',' + Math.round(mousePos.y/8);
        alert(message)
      });

      ctx.stroke();
}

function prime(M2){
  var P2 = new Array(M2.length)
  for(i in M2){
    P2[i] = new Array(M2[i].length)
    for(j in M2[i]){
      P2[i][j] = M2[j][i];
    }
  }
  return P2;
}
