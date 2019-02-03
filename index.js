var canvas = document.getElementById('canvas');

var context = canvas.getContext('2d');

var params = params || {};

// context.fillStyle = "black";
// context.fillRect(0, 0, 400, 400);
params.canvasWidth = params.canvasWidth || 640;
params.canvasHeight = params.canvasHeight || 360;
var img = document.getElementById('img');
var imgSrc = img.getAttribute('data-img');

imgSrc = imgSrc.slice(0, -5)
console.log(imgSrc);
var patch = []

function pushPath(src) {
    var i = 1;
    for (i; i < 12; i++) {
        patch[i] = src + i + ".jpg";
    }
}

pushPath(imgSrc);

var frameCounter = 1;
function draw() {
    context.clearRect(0,0,canvas.width,canvas.height);
    imageLogo = new Image();
    imageLogo.src = patch[frameCounter];
    logoWidth = imageLogo.width;
    logoHeight = imageLogo.height;
    logoX = ((params.canvasWidth - logoWidth) / 2);
    logoY = ((params.canvasHeight - logoHeight) / 2);
    context.drawImage(imageLogo, 0, 0);
    context.restore()
    frameCounter++;
    if(frameCounter ==12){
        frameCounter = 1;
    }
}



function calculateMouse(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;

    return {
        x: mouseX,
        y: mouseY
    }
}

canvas.addEventListener('mousemove', function (evt) {
    var mousePos = calculateMouse(evt);

})
window.setInterval(function () {
    draw();
    console.log(frameCounter);

}, 400);

