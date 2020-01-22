/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./scripts/indexScript.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./scripts/indexScript.js":
/*!********************************!*\
  !*** ./scripts/indexScript.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("//https://arxiv.org/ftp/arxiv/papers/1405/1405.6147.pdf\r\n//https://www.math.cuhk.edu.hk/~lmlui/dct.pdf\r\n\r\n//import { dct } from './clientNode.js';\r\n\r\nconst t = [\r\n    [.3536, .3536, .3536, .3536, .3536, .3536, .3536, .3536],\r\n    [.4904, .4157, .2778, .0975, -.0975, -.2778, -.4157, -.4904],\r\n    [.4619, .1913, -.1913, -.4619, -.4619, -.1913, .1913, .4619],\r\n    [.4157, -.0975, -.4904, -.2778, .2778, .4904, .0975, -.4157],\r\n    [.3536, -.3536, -.3536, .3536, .3536, -.3536, -.3536, .3536],\r\n    [.2778, -.4904, .0975, .4157, -.4157, -.0975, .4904, -.2778],\r\n    [.1913, -.4619, .4619, -.1913, -.1913, .4619, -.4619, .1913],\r\n    [.0975, -.2778, .4157, -.4904, .4904, -.4157, .2778, -.0975]\r\n]\r\n\r\nvar w, h;\r\nvar sData;\r\nvar img = new Image();\r\n\r\n//MAIN--------------------------------------------------------------------------------\r\nwindow.onload = function() {\r\n        var i = document.getElementsByClassName(\"image\");\r\n\r\n        initSocket();\r\n\r\n\r\n        //'data' contains all the pixel information of the image\r\n        var data = getImgData();\r\n        console.log(data);\r\n        //RGB to YCbCr Conversion\r\n        data = rgbToYCbCr(data);\r\n\r\n        //DATA NO LONGER CONTAINS ALPHA VALUE\r\n        console.log(data);\r\n\r\n        //Split Data into 8x8 Blocks\r\n        //sData is a 4 dimentional Array\r\n        //sData'[width][height]'<- Blocks '[pixel][RGBA]' <- Pixels and values\r\n        sData = splitData(data);\r\n\r\n        getDCTCoefficients();\r\n\r\n\r\n\r\n        createTable();\r\n    }\r\n    //--------------------------------------------------------------------------------\r\nfunction initSocket() {\r\n    //var sock = new WebSocket(\"ws://localhost:5001\");\r\n    //var sock = new WebSocket(\"ws://scripts/socket.js\");\r\n    var sock = new WebSocket('ws://echo.websocket.org');\r\n    sock.onopen = function(event) {\r\n        alert('Socket is connected');\r\n        setTimeout(function() {\r\n            sock.send(\"blabbermoon\");\r\n        }, 1000);\r\n    }\r\n    sock.onopen = function(event) {};\r\n\r\n    // Handle any errors that occur.\r\n    sock.onerror = function(error) {\r\n        console.log('WebSocket Error: ' + error);\r\n    };\r\n\r\n\r\n}\r\n//--------------------------------------------------------------------------------\r\nfunction createTable(x, y) {\r\n    var table = document.getElementById(\"table\");\r\n    table.innerHTML = \"\";\r\n    for (var j = 0; j < 8; j++) {\r\n        var row = table.insertRow(i);\r\n        for (var i = 7; i >= 0; i--) {\r\n            var cell = row.insertCell(0);\r\n            //grab some value\r\n            var ran = Math.floor(Math.random() * 128) + 1;\r\n            var z = j * 8 + i;\r\n            var color = Math.floor(sData[x][y][z][0]);\r\n\r\n            cell.innerHTML = color;\r\n            var colorRVT = color + 127\r\n            cell.style.backgroundColor = \"rgb(\" + colorRVT + \",\" + colorRVT + \",\" + colorRVT + \")\";\r\n\r\n            /*\r\n            var Y = Math.floor(sData[x][y][z][0]);\r\n            var Cb = Math.floor(sData[x][y][z][1]);\r\n            var Cr = Math.floor(sData[x][y][z][2]);\r\n\r\n            var r = Math.round((Y + 1.40200 * (Cr - 128)));\r\n            var g = Math.round((Y - 0.34414 * (Cb - 128) - 0.71414 * (Cr - 128)));\r\n            var b = Math.round((Y + 1.77200 * (Cb - 128)));\r\n\r\n            r = Math.max(Math.min(255, r), 0)\r\n            g = Math.max(Math.min(255, g), 0)\r\n            b = Math.max(Math.min(255, b), 0)\r\n            cell.innerHTML = Y;\r\n            cell.style.backgroundColor = \"rgb(\"+r+\",\"+g+\",\"+b+\")\";\r\n            */\r\n\r\n\r\n        }\r\n    }\r\n}\r\n//--------------------------------------------------------------------------------\r\nfunction getImgData() {\r\n\r\n    var canvas = document.getElementById(\"preview\");\r\n    var ctx = canvas.getContext(\"2d\");\r\n    ctx.crossOrigin = \"Anonymous\";\r\n\r\n    drawGrid(ctx);\r\n\r\n    console.log(canvas);\r\n\r\n    //get image\r\n    img.src = \"../image/dog.jpg\";\r\n    w = img.width;\r\n    h = img.height;\r\n    canvas.width = img.width;\r\n    canvas.height = img.height;\r\n\r\n    //put image on canvas\r\n    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);\r\n    imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height);\r\n    //console.log(imgdata);\r\n\r\n    //console.log(img.height);\r\n\r\n    for (var i = 0; i < imgdata.data.length; i = i + 2) {\r\n        //imgdata.data[i] = imgdata.data[i] -200;\r\n    }\r\n    //PUT IMAGE DATA ON CANVAS\r\n    ctx.putImageData(imgdata, 0, 0);\r\n\r\n\r\n    //Function to draw a 8x8 grid over the canvas\r\n    drawGrid(ctx);\r\n\r\n    ctx.moveTo(20, 20);\r\n    ctx.lineTo(40, 40);\r\n\r\n\r\n    return imgdata;\r\n\r\n}\r\n//--------------------------------------------------------------------------------\r\nfunction rgbToYCbCr(data) {\r\n\r\n    /*\r\n    Grabs values of the image off of the CANVAS\r\n    Each pixel has 4 values (RGBA)\r\n    data[0] = R\r\n    data[1] = G\r\n    data[2] = B\r\n    data[3] = A\r\n    etc...\r\n\r\n    https://sistenix.com/rgb2ycbcr.html\r\n\r\n    */\r\n\r\n    var arr = new Array();\r\n\r\n    for (var i = 0; i < imgdata.data.length; i = i + 4) {\r\n        //RGB values are the same\r\n        var r = imgdata.data[i];\r\n        var g = imgdata.data[i + 1];\r\n        var b = imgdata.data[i + 2];\r\n        var a = imgdata.data[i + 3];\r\n\r\n\r\n        var Y = 16 + (65.738 * r) / 256 + (129.057 * g) / 256 + (25.064 * b) / 256;\r\n        var Cb = 128 - (37.945 * r) / 256 + (74.494 * g) / 256 + (112.439 * b) / 256;\r\n        var Cr = 128 + (112.439 * r) / 256 + (94.154 * g) / 256 + (18.285 * b) / 256;\r\n\r\n\r\n        //shift from range(0-255) to (-128-127)\r\n        arr[i] = Y - 128;\r\n        arr[i + 1] = Cb - 128;\r\n        arr[i + 2] = Cr - 128;\r\n        arr[i + 3] = 0;\r\n\r\n    }\r\n\r\n    return arr;\r\n}\r\n//--------------------------------------------------------------------------------\r\nfunction splitData(data) {\r\n\r\n    //how many blocks horizontally\r\n    bw = w / 8;\r\n    //how many blocks horizontally\r\n    bh = h / 8;\r\n    var offset = 0;\r\n\r\n    console.log(\"DEBUG: WIDTH: \" + w + \" HEIGHT: \" + h);\r\n    console.log(\"DEBUG: BLOCK-WIDTH: \" + bw + \" BLOCK-HEIGHT: \" + bh);\r\n\r\n    var splitData = new Array(bw);\r\n    for (var col = 0; col < bw; col++) {\r\n        splitData[col] = new Array(bh);\r\n        for (var row = 0; row < bh; row++) {\r\n            splitData[col][row] = new Array(64);\r\n            for (var pixel = 0; pixel < 64; pixel++) {\r\n                splitData[col][row][pixel] = new Array(4);\r\n\r\n                splitData[col][row][pixel][0] = 0;\r\n                splitData[col][row][pixel][1] = 0;\r\n                splitData[col][row][pixel][2] = 0;\r\n                splitData[col][row][pixel][3] = 0;\r\n\r\n            }\r\n        }\r\n    }\r\n\r\n    //console.log(splitData);\r\n\r\n    for (var val = 0; val < data.length; val += 4) {\r\n        //p is the value of pixel over image\r\n        var p = val / 4;\r\n        // x is position of p\r\n        var x = p % w;\r\n        // y is position of p\r\n        var y = Math.floor(p / w);\r\n\r\n        //cell identifier COLUMN\r\n        var i = Math.floor(x / 8);\r\n        //cell identifier ROW\r\n        var j = Math.floor(y / 8);\r\n\r\n        var pixel = x % 8 + (y % 8 * 8);\r\n\r\n        //console.log(\"DEBUG: I: \" + i + \" J : \" + j + \" Pixel: \" + pixel);\r\n        //console.log(\"DEBUG: X: \" + x + \" Y : \" + y + \" P: \" + p);\r\n\r\n        splitData[i][j][pixel][0] = data[val];\r\n        splitData[i][j][pixel][1] = data[val + 1];\r\n        splitData[i][j][pixel][2] = data[val + 2];\r\n        splitData[i][j][pixel][3] = data[val + 3];\r\n\r\n\r\n\r\n\r\n    }\r\n\r\n    console.log(splitData);\r\n\r\n\r\n    /*\r\n      //Array of blocks on WIDTH\r\n      var splitData = new Array(bw);\r\n      for(var i = 0; i < bw; i++){\r\n        //Array of blocks on HEIGHT\r\n        splitData[i] = new Array(bh);\r\n        for(var j = 0; j < bh; j++){\r\n          //Array of Pixels in each block\r\n          splitData[i][j] = new Array(64);\r\n          offset = offset+j;\r\n          for(var k = 0; k < 64; k++){\r\n            //RGB data for each pixel\r\n            splitData[i][j][k] = new Array(4);\r\n            /*\r\n            splitData[i][j][k][0] = i+j+k+offset;\r\n            splitData[i][j][k][1] = i+j+k+1+offset;\r\n            splitData[i][j][k][2] = i+j+k+2+offset;\r\n            splitData[i][j][k][3] = i+j+k+3+offset;\r\n            splitData[i][j][k][0] = data[(i*8)+(j*8*bw)+k+offset];\r\n            splitData[i][j][k][1] = data[i+j+k+1+offset];\r\n            splitData[i][j][k][2] = data[i+j+k+2+offset];\r\n            splitData[i][j][k][3] = data[i+j+k+3+offset];\r\n\r\n            if((k+1)%8==0) {\r\n              //end of row\r\n              offset = offset +\r\n            }\r\n            offset = offset + 3;\r\n          }\r\n          offset = offset + 62 - j;\r\n        }\r\n        offset = offset + 119;\r\n      }\r\n      */\r\n\r\n    //console.log(splitData);\r\n\r\n    return splitData;\r\n\r\n}\r\n//--------------------------------------------------------------------------------\r\nfunction drawGrid(ctx) {\r\n    var canvas = document.getElementById(\"preview\");\r\n    var width = canvas.width;\r\n    var height = canvas.height;\r\n\r\n    function highlightCell(i, j) {\r\n        i = Math.round(i);\r\n        j = Math.round(j);\r\n        var x = Math.floor(i / 8);\r\n        var y = Math.floor(j / 8);\r\n\r\n        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);\r\n        ctx.fillStyle = 'rgba(0, 255, 0, 0.40)';\r\n        ctx.fillRect(x * 8, y * 8, 8, 8);\r\n\r\n        createTable(x, y);\r\n\r\n    }\r\n\r\n    function getMousePos(canvas, evt) {\r\n        var rect = canvas.getBoundingClientRect(), // abs. size of element\r\n            scaleX = canvas.width / rect.width, // relationship bitmap vs. element for X\r\n            scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y\r\n\r\n        return {\r\n            x: (evt.clientX - rect.left) * scaleX, // scale mouse coordinates after they have\r\n            y: (evt.clientY - rect.top) * scaleY // been adjusted to be relative to element\r\n        }\r\n    }\r\n\r\n    canvas.addEventListener('mousemove', function(evt) {\r\n        //console.log(\"Something\");\r\n        var pos = getMousePos(canvas, evt);\r\n        //console.log(pos);\r\n        highlightCell(pos.x, pos.y);\r\n    }, false);\r\n    canvas.addEventListener('click', function(evt) {\r\n        var mousePos = getMousePos(canvas, evt);\r\n        var message = 'Mouse position: ' + Math.round(mousePos.x / 8) + ',' + Math.round(mousePos.y / 8);\r\n        alert(message)\r\n    });\r\n\r\n    ctx.stroke();\r\n}\r\n\r\nfunction prime(M2) {\r\n    var P2 = new Array(M2.length)\r\n    for (i in M2) {\r\n        P2[i] = new Array(M2[i].length)\r\n        for (j in M2[i]) {\r\n            P2[i][j] = M2[j][i];\r\n        }\r\n    }\r\n    return P2;\r\n}\r\n\r\nfunction getDCTCoefficients() {\r\n    //Return SplitData's DCT coefficients\r\n\r\n\r\n    //This is a 2D DCT\r\n    var trans = transposeArray(t, 8);\r\n\r\n    var coefficients = JSON.parse(JSON.stringify(sData));\r\n    for (var i = 0; i < sData.length; i++) {\r\n\r\n        for (var j = 0; j < sData[0].length; j++) {\r\n            var matrix = getBlock(i, j);\r\n\r\n            var Y = [\r\n                [],\r\n                [],\r\n                [],\r\n                [],\r\n                [],\r\n                [],\r\n                [],\r\n                []\r\n            ];\r\n            var Cb = [\r\n                [],\r\n                [],\r\n                [],\r\n                [],\r\n                [],\r\n                [],\r\n                [],\r\n                []\r\n            ];\r\n            var Cr = [\r\n                [],\r\n                [],\r\n                [],\r\n                [],\r\n                [],\r\n                [],\r\n                [],\r\n                []\r\n            ];\r\n            var A = [\r\n                [],\r\n                [],\r\n                [],\r\n                [],\r\n                [],\r\n                [],\r\n                [],\r\n                []\r\n            ];\r\n            /*\r\n            Y = [\r\n              [26,-5,-5,-5,-5,-5,-5,8],\r\n              [64,52,8,26,26,26,8,-18],\r\n              [126,70,26,26,52,26,-5,-5],\r\n              [111,52,8,52,52,38,-5,-5],\r\n              [52,26,8,39,38,21,8,8],\r\n              [0,8,-5,8,26,52,70,26],\r\n              [-5,-23,-18,21,8,8,52,38],\r\n              [-18,8,-5,-5,-5,8,26,8]\r\n            ]\r\n            */\r\n            for (var x = 0; x < 8; x++) {\r\n                for (var y = 0; y < 8; y++) {\r\n\r\n                    Y[x][y] = Math.round(matrix[x][y][0]);\r\n                    Cb[x][y] = Math.round(matrix[x][y][1]);\r\n                    Cr[x][y] = Math.round(matrix[x][y][2]);\r\n                    A[x][y] = Math.round(matrix[x][y][3]);\r\n                }\r\n            }\r\n\r\n            //console.log(Y, Cb)\r\n            dctY = crossProduct(crossProduct(t, Y), trans);\r\n            dctCb = crossProduct(crossProduct(t, Cb), trans);\r\n            dctCr = crossProduct(crossProduct(t, Cr), trans);\r\n            dctA = crossProduct(crossProduct(t, A), trans);\r\n\r\n\r\n            //coefficients[BlockX][BlockY][Channel][PixelX][PixelY]\r\n            coefficients[i][j] = [dctY, dctCb, dctCr, dctA];\r\n        }\r\n    }\r\n\r\n\r\n    console.log(coefficients);\r\n\r\n\r\n    //console.log(testMatrix);\r\n\r\n    function transposeArray(array, arrayLength) {\r\n        //This function takes in an array and transposes it\r\n        var newArray = [];\r\n        for (var i = 0; i < array.length; i++) {\r\n            newArray.push([]);\r\n        };\r\n\r\n        for (var i = 0; i < array.length; i++) {\r\n            for (var j = 0; j < arrayLength; j++) {\r\n                newArray[j].push(array[i][j]);\r\n            };\r\n        };\r\n\r\n        return newArray;\r\n    }\r\n\r\n    function crossProduct(ar1, ar2) {\r\n        //This function gets the crossProduct of two arrays thats 8x8\r\n        var c = [\r\n            [],\r\n            [],\r\n            [],\r\n            [],\r\n            [],\r\n            [],\r\n            [],\r\n            []\r\n        ];\r\n        for (var i = 0; i < 8; i++) {\r\n            for (var j = 0; j < 8; j++) {\r\n                c[i][j] =\r\n                    ar1[i][0] * ar2[0][j] +\r\n                    ar1[i][1] * ar2[1][j] +\r\n                    ar1[i][2] * ar2[2][j] +\r\n                    ar1[i][3] * ar2[3][j] +\r\n                    ar1[i][4] * ar2[4][j] +\r\n                    ar1[i][5] * ar2[5][j] +\r\n                    ar1[i][6] * ar2[6][j] +\r\n                    ar1[i][7] * ar2[7][j];\r\n                c[i][j] = Math.round(c[i][j] * 10) / 10;\r\n            }\r\n        }\r\n        return c;\r\n    }\r\n\r\n    function getBlock(i, j) {\r\n        //gets a specific block of data\r\n        var c = [\r\n            [],\r\n            [],\r\n            [],\r\n            [],\r\n            [],\r\n            [],\r\n            [],\r\n            []\r\n        ];\r\n        for (var p = 0; p < 64; p++) {\r\n            c[Math.floor(p / 8)][p % 8] = sData[i][j][p];\r\n        }\r\n        return c;\r\n    }\r\n\r\n}\n\n//# sourceURL=webpack:///./scripts/indexScript.js?");

/***/ })

/******/ });