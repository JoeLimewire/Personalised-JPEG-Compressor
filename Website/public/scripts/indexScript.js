window.addEventListener('DOMContentLoaded', function() {
    //https://arxiv.org/ftp/arxiv/papers/1405/1405.6147.pdf
    //https://www.math.cuhk.edu.hk/~lmlui/dct.pdf

    //import { dct } from './clientNode.js';
    const t = [
        [.3536, .3536, .3536, .3536, .3536, .3536, .3536, .3536],
        [.4904, .4157, .2778, .0975, -.0975, -.2778, -.4157, -.4904],
        [.4619, .1913, -.1913, -.4619, -.4619, -.1913, .1913, .4619],
        [.4157, -.0975, -.4904, -.2778, .2778, .4904, .0975, -.4157],
        [.3536, -.3536, -.3536, .3536, .3536, -.3536, -.3536, .3536],
        [.2778, -.4904, .0975, .4157, -.4157, -.0975, .4904, -.2778],
        [.1913, -.4619, .4619, -.1913, -.1913, .4619, -.4619, .1913],
        [.0975, -.2778, .4157, -.4904, .4904, -.4157, .2778, -.0975]
    ]

    const loadingImg = document.getElementById("loading");
    var quantiseZeroCount = 0;

    var w, h;
    var sData;
    var quality = 50;
    var img = new Image();
    var imgdata;

    document.getElementById("btnQuantise").addEventListener("click", function() {
        quantiseZeroCount = 0;
        console.log("Loading...");
        var startTime = (new Date()).getTime();
        runCom(quality, function() {
            document.getElementById("timeTaken").innerHTML = (new Date()).getTime() - startTime + "ms";
        });

        console.log(img);
        var imgByteSize = getImageSizeInBytes(img.src);
        console.log(quantiseZeroCount);
        //This negates the alpha channel of the quantise matrix which is filled with 0's.
        quantiseZeroCount = quantiseZeroCount - w*h;
        //Get the average amount of numbers in each block
        console.log(quantiseZeroCount);
        quantiseZeroCount = (quantiseZeroCount/(img.width/8))/img.height/8;
        console.log(quantiseZeroCount);
        //Get predicted file size of compressed image.
        var compressedFileSize = Math.round(imgByteSize/quantiseZeroCount);
        console.log(compressedFileSize);

        document.getElementById("imgSize").innerHTML = "Original Image Size = " + imgByteSize + " Bytes";
        document.getElementById("compressedSize").innerHTML = " Estimated Compressed Image Size ~ " + compressedFileSize + " Bytes";

    }, false);

    function getImageSizeInBytes(imgURL) {
      //This gets the size of the current image in bytes
      var request = new XMLHttpRequest();
      request.open("HEAD", imgURL, false);
      request.send(null);
      var headerText = request.getAllResponseHeaders();
      var re = /Content\-Length\s*:\s*(\d+)/i;
      re.exec(headerText);
      return parseInt(RegExp.$1);
}

    document.getElementById("myRange").addEventListener("input", function() {
        var qpercent = document.getElementById("myRange");
        quality = qpercent.value;

        document.getElementById("qPercent").innerHTML = quality + "%";
    });

    document.getElementById("imgSelect").addEventListener("change", function() {

        document.getElementById("imgDiv").innerHTML = "<img class='image' src='image/" + this.value + "'>"
    });

    function runCom(quality, callback) {

        //MAIN--------------------------------------------------------------------------------
        //window.onload = function() {
        var i = document.getElementsByClassName("image");



        initSocket();

        //'data' contains all the pixel information of the image
        imgdata = getImgData();
        console.log(imgdata);

        alert("Successful: Processing Image \n This may take a while, please be patient. \n Press 'Ok' to continue");

        //RGB to YCbCr Conversion
        imgdata = rgbToYCbCr(imgdata);
        console.log("YCbCr: ");
        console.log(imgdata);

        //Split Data into 8x8 Blocks
        //sData is a 4 dimentional Array
        //sData'[width][height]'<- Blocks '[pixel][RGBA]' <- Pixels and values
        sData = splitData(imgdata);

        //This grabs the co efficients of each block
        // Still the same format as previous execution
        var c = getDCTCoefficients();
        console.log("Coefficients: ");
        console.log(c);


        //Gets rid of unessasery coEfficients
        //New format  - '[width][height]'<- Blocks ' [Channel] <- Colour (YCBCr) [pixelX][pixelY]
        var qc = quantise(c, quality);

        console.log("Quantise: " + quality);
        console.log(qc);

        var r = reconstruct(quality, qc);

        console.log("Reconstruct: " + quality);
        console.log(r);

        var N = decompress(r);

        //Apply coEffeccient Weight to Block
        console.log("Decompressed Image: ");
        console.log(N);

        var Cvalues = YCbCrtoRGB(N);

        console.log("RGB Decompressed Image: ");
        console.log(Cvalues);

        var newimgdata = formatData(Cvalues);
        console.log("Formatted Data: ");
        console.log(newimgdata);

        printImg(newimgdata);

        sData = splitData(newimgdata);

        callback();
    }
    //--------------------------------------------------------------------------------
    function initSocket() {
        //var sock = new WebSocket("ws://localhost:5001");
        //var sock = new WebSocket("ws://scripts/socket.js");
        var sock = new WebSocket('ws://echo.websocket.org');
        sock.onopen = function(event) {
            alert('Socket is connected');
            setTimeout(function() {
                sock.send("blabbermoon");
            }, 1000);
        }
        sock.onopen = function(event) {};

        // Handle any errors that occur.
        sock.onerror = function(error) {
            console.log('WebSocket Error: ' + error);
        };


    }
    //--------------------------------------------------------------------------------
    function createTable(x, y) {
        var table = document.getElementById("table");

        table.innerHTML = "";
        for (var j = 0; j < 8; j++) {
            var row = table.insertRow(i);
            for (var i = 7; i >= 0; i--) {
                var cell = row.insertCell(0);
                //grab some value
                var z = j * 8 + i;
                var r = Math.floor(sData[x][y][z][0]);
                var g = Math.floor(sData[x][y][z][1]);
                var b = Math.floor(sData[x][y][z][2]);

                //cell.innerHTML = r;
                cell.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
                /*
                var Y = Math.floor(sData[x][y][z][0]);
                var Cb = Math.floor(sData[x][y][z][1]);
                var Cr = Math.floor(sData[x][y][z][2]);

                var r = Math.round((Y + 1.40200 * (Cr - 128)));
                var g = Math.round((Y - 0.34414 * (Cb - 128) - 0.71414 * (Cr - 128)));
                var b = Math.round((Y + 1.77200 * (Cb - 128)));

                r = Math.max(Math.min(255, r), 0)
                g = Math.max(Math.min(255, g), 0)
                b = Math.max(Math.min(255, b), 0)
                cell.innerHTML = Y;
                cell.style.backgroundColor = "rgb("+r+","+g+","+b+")";
                */


            }
        }
    }
    //--------------------------------------------------------------------------------
    function getImgData() {



        var canvas = document.getElementById("preview");
        var ctx = canvas.getContext("2d");
        ctx.crossOrigin = "Anonymous";

        //console.log(document.getElementById("imgSelect").value);

        var e = document.getElementById("imgSelect");
        console.log(e.value);

        drawGrid(ctx);

        console.log(canvas);

        //get image

        img = new Image();
        img.src = "../image/" + e.value;
        //img.src = document.getElementById("imgSelector").value;

        w = img.width;
        h = img.height;
        canvas.width = img.width;
        canvas.height = img.height;

        console.log("../image/" + e.value + w);

        //put image on canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height);
        //console.log(imgdata);

        //console.log(img.height);

        for (var i = 0; i < imgdata.data.length; i = i + 2) {
            //imgdata.data[i] = imgdata.data[i] -200;
        }
        //PUT IMAGE DATA ON CANVAS
        ctx.putImageData(imgdata, 0, 0);


        //Function to draw a 8x8 grid over the canvas
        drawGrid(ctx);

        return imgdata;

    }
    //--------------------------------------------------------------------------------
    function rgbToYCbCr(data) {

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

        for (var i = 0; i < imgdata.data.length; i = i + 4) {
            //RGB values are the same
            var r = imgdata.data[i];
            var g = imgdata.data[i + 1];
            var b = imgdata.data[i + 2];
            var a = imgdata.data[i + 3];

            Y = 0.257 * r + 0.504 * g + 0.098 * b + 16
            Cb = -0.148 * r - 0.291 * g + 0.439 * b + 128
            Cr = 0.439 * r - 0.368 * g - 0.071 * b + 128


            //shift from range(0-255) to (-128-127)
            arr[i] = Y - 128;
            arr[i + 1] = Cb - 128;
            arr[i + 2] = Cr - 128;
            arr[i + 3] = 0;

        }

        return arr;
    }
    //--------------------------------------------------------------------------------
    function splitData(data) {

        //how many blocks horizontally
        bw = w / 8;
        //how many blocks horizontally
        bh = h / 8;
        var offset = 0;

        console.log("DEBUG: WIDTH: " + w + " HEIGHT: " + h);
        console.log("DEBUG: BLOCK-WIDTH: " + bw + " BLOCK-HEIGHT: " + bh);

        var splitData = new Array(bw);
        for (var col = 0; col < bw; col++) {
            splitData[col] = new Array(bh);
            for (var row = 0; row < bh; row++) {
                splitData[col][row] = new Array(64);
                for (var pixel = 0; pixel < 64; pixel++) {
                    splitData[col][row][pixel] = new Array(4);

                    splitData[col][row][pixel][0] = 0;
                    splitData[col][row][pixel][1] = 0;
                    splitData[col][row][pixel][2] = 0;
                    splitData[col][row][pixel][3] = 0;

                }
            }
        }

        //console.log(splitData);

        for (var val = 0; val < data.length; val += 4) {
            //p is the value of pixel over image
            var p = val / 4;
            // x is position of p
            var x = p % w;
            // y is position of p
            var y = Math.floor(p / w);

            //cell identifier COLUMN
            var i = Math.floor(x / 8);
            //cell identifier ROW
            var j = Math.floor(y / 8);

            var pixel = x % 8 + (y % 8 * 8);

            //console.log("DEBUG: I: " + i + " J : " + j + " Pixel: " + pixel);
            //console.log("DEBUG: X: " + x + " Y : " + y + " P: " + p);

            splitData[i][j][pixel][0] = data[val];
            splitData[i][j][pixel][1] = data[val + 1];
            splitData[i][j][pixel][2] = data[val + 2];
            splitData[i][j][pixel][3] = data[val + 3];




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
    function drawGrid(ctx) {
        var canvas = document.getElementById("preview");
        var width = canvas.width;
        var height = canvas.height;

        function highlightCell(i, j) {
            i = Math.round(i);
            j = Math.round(j);
            var x = Math.floor(i / 8);
            var y = Math.floor(j / 8);

            printImg(imgdata);
            ctx.fillStyle = 'rgba(0, 255, 0, 0.40)';
            ctx.fillRect(x * 8, y * 8, 8, 8);

            createTable(x, y);

        }

        function getMousePos(canvas, evt) {
            var rect = canvas.getBoundingClientRect(), // abs. size of element
                scaleX = canvas.width / rect.width, // relationship bitmap vs. element for X
                scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y

            return {
                x: (evt.clientX - rect.left) * scaleX, // scale mouse coordinates after they have
                y: (evt.clientY - rect.top) * scaleY // been adjusted to be relative to element
            }
        }

        canvas.addEventListener('mousemove', function(evt) {
            //console.log("Something");
            var pos = getMousePos(canvas, evt);
            //console.log(pos);
            highlightCell(pos.x, pos.y);
        }, false);

        ctx.stroke();
    }
    //--------------------------------------------------------------------------------
    function prime(M2) {
        var P2 = new Array(M2.length)
        for (i in M2) {
            P2[i] = new Array(M2[i].length)
            for (j in M2[i]) {
                P2[i][j] = M2[j][i];
            }
        }
        return P2;
    }
    //--------------------------------------------------------------------------------
    function getDCTCoefficients() {
        //Return SplitData's DCT coefficients


        //This is a 2D DCT
        var trans = transposeArray(t, 8);

        var coefficients = JSON.parse(JSON.stringify(sData));
        for (var i = 0; i < sData.length; i++) {

            for (var j = 0; j < sData[0].length; j++) {
                var matrix = getBlock(i, j);

                var Y = [
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    []
                ];
                var Cb = [
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    []
                ];
                var Cr = [
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    []
                ];
                var A = [
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    []
                ];
                /*
                Y = [
                  [26,-5,-5,-5,-5,-5,-5,8],
                  [64,52,8,26,26,26,8,-18],
                  [126,70,26,26,52,26,-5,-5],
                  [111,52,8,52,52,38,-5,-5],
                  [52,26,8,39,38,21,8,8],
                  [0,8,-5,8,26,52,70,26],
                  [-5,-23,-18,21,8,8,52,38],
                  [-18,8,-5,-5,-5,8,26,8]
                ]
                */
                for (var x = 0; x < 8; x++) {
                    for (var y = 0; y < 8; y++) {

                        Y[x][y] = Math.round(matrix[x][y][0]);
                        Cb[x][y] = Math.round(matrix[x][y][1]);
                        Cr[x][y] = Math.round(matrix[x][y][2]);
                        A[x][y] = Math.round(matrix[x][y][3]);
                    }
                }

                //console.log(Y, Cb)
                dctY = crossProduct(crossProduct(t, Y), trans);
                dctCb = crossProduct(crossProduct(t, Cb), trans);
                dctCr = crossProduct(crossProduct(t, Cr), trans);
                dctA = crossProduct(crossProduct(t, A), trans);


                //coefficients[BlockX][BlockY][Channel][PixelX][PixelY]
                coefficients[i][j] = [dctY, dctCb, dctCr, dctA];


            }
        }


        return coefficients;


        //console.log(testMatrix);

        function getBlock(i, j) {
            //gets a specific block of data
            var c = [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ];
            for (var p = 0; p < 64; p++) {
                c[Math.floor(p / 8)][p % 8] = sData[i][j][p];
            }
            return c;
        }

    }

    function quantise(c, qual) {
        var qc = JSON.parse(JSON.stringify(c));

        for (var i = 0; i < c.length; i++) {
            for (var j = 0; j < c[0].length; j++) {
                qc[i][j][0] = qBlock(c[i][j][0], qual);
                //console.log(i, j, c[i][j][0], qc[i][j][0])
                qc[i][j][1] = qBlock(c[i][j][1], qual);
                qc[i][j][2] = qBlock(c[i][j][2], qual);
                qc[i][j][3] = qBlock(c[i][j][3], qual);
            }

        }

        function qBlock(block, quality) {
            //console.log(block);

            var qmat = getQualMatrix(quality);

            var result = [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ];
            for (var i = 0; i < 8; i++) {
                for (var j = 0; j < 8; j++) {
                    result[i][j] = Math.round(block[i][j] / qmat[j * 8 + i]);
                    if(result[i][j] == 0 ||result[i][j] == -0) quantiseZeroCount = quantiseZeroCount + 1;
                }
            }
            return result;

        }


        console.log(quantiseZeroCount);
        return qc;


        /*
        //De quantisation
        return quant8x8.map((q, i) => q * qmat[i]);
        */
    }

    function getQualMatrix(quality) {

        const q50 = [
            16, 11, 10, 16, 24, 40, 51, 61,
            12, 12, 14, 19, 26, 58, 60, 55,
            14, 13, 16, 24, 40, 57, 69, 56,
            14, 17, 22, 29, 51, 87, 80, 62,
            18, 22, 37, 56, 68, 109, 103, 77,
            24, 35, 55, 64, 81, 104, 113, 92,
            49, 64, 78, 87, 103, 121, 120, 101,
            72, 92, 95, 98, 112, 100, 103, 99
        ];
        var qmat;
        //console.log(quality, (quality > 50));


        //Math.max(Math.min(Math.round(q * (100 - quality) / 50), 255), 1);

        if (quality > 50) qmat = q50.map(q => Math.max(Math.min(Math.round(q * (100 - quality) / 50), 255), 1));
        else if (quality < 50) qmat = q50.map(q => Math.min(Math.max(Math.round(q * 50 / quality), 1), 255));
        else { qmat = q50 };

        return qmat;
    }

    function reconstruct(quality, c) {

        var qmat = getQualMatrix(quality);
        var r = JSON.parse(JSON.stringify(c));

        for (var i = 0; i < c.length; i++) {
            for (var j = 0; j < c[0].length; j++) {
                r[i][j][0] = rBlock(c[i][j][0], qmat);
                r[i][j][1] = rBlock(c[i][j][1], qmat);
                r[i][j][2] = rBlock(c[i][j][2], qmat);
                r[i][j][3] = rBlock(c[i][j][3], qmat);
            }
        }
        return r;

        function rBlock(block, qmat) {
            //console.log(block, qmat);
            var result = [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ];
            for (var i = 0; i < 8; i++) {
                for (var j = 0; j < 8; j++) {
                    result[i][j] = Math.round(block[i][j] * qmat[j * 8 + i]);
                }
            }
            return result;
        }




    }

    function decompress(r) {
        var r = JSON.parse(JSON.stringify(r));

        for (var i = 0; i < r.length; i++) {
            for (var j = 0; j < r[0].length; j++) {
                r[i][j][0] = dBlock(r[i][j][0]);
                r[i][j][1] = dBlock(r[i][j][1]);
                r[i][j][2] = dBlock(r[i][j][2]);
                r[i][j][3] = dBlock(r[i][j][3]);
            }
        }

        return r;
    }

    function dBlock(block) {

        var trans = transposeArray(t, 8);

        var N = crossProduct(crossProduct(trans, block), t);
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                N[i][j] = Math.round(N[i][j]) + 128;
            }
        }

        return N;
    }

    function transposeArray(array, arrayLength) {
        //This function takes in an array and transposes it
        var newArray = [];
        for (var i = 0; i < array.length; i++) {
            newArray.push([]);
        };

        for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < arrayLength; j++) {
                newArray[j].push(array[i][j]);
            };
        };

        return newArray;
    }

    function crossProduct(ar1, ar2) {
        //This function gets the crossProduct of two arrays thats 8x8
        var c = [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ];
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                c[i][j] =
                    ar1[i][0] * ar2[0][j] +
                    ar1[i][1] * ar2[1][j] +
                    ar1[i][2] * ar2[2][j] +
                    ar1[i][3] * ar2[3][j] +
                    ar1[i][4] * ar2[4][j] +
                    ar1[i][5] * ar2[5][j] +
                    ar1[i][6] * ar2[6][j] +
                    ar1[i][7] * ar2[7][j];
                c[i][j] = Math.round(c[i][j] * 10) / 10;
            }
        }
        return c;
    }

    function YCbCrtoRGB(ycbcr) {

        var N = JSON.parse(JSON.stringify(ycbcr));
        var Y, Cb, Cr;

        for (var i = 0; i < N.length; i++) {
            for (var j = 0; j < N[0].length; j++) {


                for (var x = 0; x < 8; x++) {
                    for (var y = 0; y < 8; y++) {
                        Y = N[i][j][0][x][y];
                        Cb = N[i][j][1][x][y];
                        Cr = N[i][j][2][x][y];
                        a = N[i][j][3][x][y];

                        var r = Y + 1.40200 * (Cr - 128);
                        var g = Y - 0.34414 * (Cb - 128) - 0.71414 * (Cr - 128);
                        var b = Y + 1.77200 * (Cb - 128);
                        var a = 255;

                        /*
                        r = 1.164 * (Y - 16) + 1.596 * (Cr - 128);
                        g = 1.164 * (Y - 16) - 0.813 * (Cr - 128) - 0.392 * (Cb - 128);
                        b = 1.164 * (Y - 16) + 2.017 * (Cb - 128);
                        */

                        r = Math.round(Math.max(0, Math.min(255, r)));
                        g = Math.round(Math.max(0, Math.min(255, g)));
                        b = Math.round(Math.max(0, Math.min(255, b)));


                        N[i][j][0][x][y] = r;

                        //CHANGED GREEN VALUE AROUND.
                        N[i][j][1][x][y] = g;
                        N[i][j][2][x][y] = b;
                        N[i][j][3][x][y] = a;


                    }
                }



            }
        }
        return N;

    }

    function formatData(data) {
        let arraylen = imgdata.length / 4;
        var newimgdata = new Array(arraylen);
        for (let p = 0; p < arraylen; p++) {

            var i = Math.floor((p % w) / 8);
            var j = Math.floor(Math.floor(p / w) / 8);
            //p is the position of the pixel
            //j is the y of the lock
            //i is the x of the blovk
            //w is the width of the image
            var x = (p % w) % 8;
            //
            var y = Math.floor((p / w) % 8);

            newimgdata[p * 4] = data[i][j][0][y][x]; //R
            newimgdata[p * 4 + 1] = data[i][j][1][y][x]; //G
            newimgdata[p * 4 + 2] = data[i][j][2][y][x]; //B
            newimgdata[p * 4 + 3] = data[i][j][3][x][y];


        }
        return newimgdata;
    }

    function printImg(newimgdata) {
        imgdata = new Uint8ClampedArray(newimgdata);
        //console.log(imgdata);

        var canvas = document.getElementById("preview");
        var ctx = canvas.getContext("2d");
        ctx.crossOrigin = "Anonymous";
        //put image on canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        //PUT IMAGE DATA ON CANVAS
        var d = new ImageData(imgdata, w, h);

        ctx.putImageData(d, 0, 0);

    };
});
