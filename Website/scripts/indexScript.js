window.onload =function(){
    var i = document.getElementsByClassName("image");

    createTable();
    canvas()


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
  var img = new Image();
  img.src = "hotBalloon.jpg";
  ctx.drawImage(img,0,0,canvas.width,canvas.height);


}
