/**
 * Filename: canvas360.js
 *
 * Creates a 360 view using an array of images using a canvas element.
 */

function canvas360(params) {

    params = params || {};
    /**

     */
    params.canvasId = params.canvasId || "canvas";
    /**
     *  canvasWidth is the width of the canvas element.
     */
    params.canvasWidth = params.canvasWidth || 458;
    /**
     *  canvasHeight is the height of the canvas element.
     */
    params.canvasHeight = params.canvasHeight || 458;
    /**
     *  framesPath is the location where the frames can be found.
     */
    params.framesPath = params.framesPath || 'https://barrychampion.com/prototypes/dd/360/images/sm/640511_01.jpg';
    /**
     *  framesFile is the filenames array.
     */
    params.framesFile = params.framesFile || '';
    /**
     *  framesCount is the number of frames that will exist.
     */
    params.framesCount = params.framesCount || 6;
    /**
     *  Do we need to reverse the frame order?
     */
    params.framesReverse = params.framesReverse || false;
    /**
     *  logoImagePath is the url of the logo which will show up during loading.
     */
    params.logoImagePath = params.logoImagePath || "https://barrychampion.com/prototypes/dd/360/images/sm/640511_01.jpg"
    /**
     *  loaderBarColor should be an HTML color code matching the color you wish
     *  to be used to frame in the progress bar when loading images and data.
     */
    params.loaderBarColor = params.loaderBarColor || '#ffffff';
    /**
     *  loaderFillColor should be an HTML color code matching the color you
     *  wish to be used to fill the progress bar.
     */
    params.loaderFillColor = params.loaderFillColor || '#fecd18';
    /**
     *  loaderFillGradient set's canvas360 to use a gradient fill on the progress bar.
     *  If false it will use loaderFillColor. If true it will draw a gradient from
     *  loaderFillColor to loaderFillColor2.
     */
    params.loaderFillGradient = params.loaderFillGradient || false;
    /**
     *  loaderFillColor2 is the second color for the progressbar if loaderFillGradient
     *  is set to true.
     */
    params.loaderFillColor2 = params.loaderFillColor2 || '#ffffff';
    var img = document.getElementById('img');
    var imgSrc = img.getAttribute('data-img');

    imgSrc = imgSrc.slice(0, -5)
    console.log(imgSrc);

    var patch = []

    function pushPath(src) {
        var i = 1;
        for (i; i <  params.framesCount; i++) {
            patch[i] = src + i + ".jpg";
        }
    }

    pushPath(imgSrc);

    var frameImages = [];
    params.framesPath = patch;
    console.log(params);
    var strokeX = 0;
    var strokeY = 0;
    var strokeWidth = 0;
    var strokeHeight = 15;
    var countFrames = 0;
    var loadPercent = 0;
    var curFrame = 0;
    var frameCount = 0;
    var animDirection = 0;
    var animatingFrames = false;

    var imagePositionX = 0;
    var imagePositionY = 0;

    //***** Swipe Detection Code

    var HORIZONTAL = 1;
    var VERTICAL = 2;
    var AXIS_THRESHOLD = 50;
    var GESTURE_DELTA = 100;

    var direction = HORIZONTAL;

    /** Extend the window with a custom function that works off of either the
     * new requestAnimationFrame functionality which is available in many modern
     * browsers or utilizes the setTimeout function where not available.
     */

    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame || // Chromium
            window.webkitRequestAnimationFrame || // WebKit
            window.mozRequestAnimationFrame || // Mozilla
            window.oRequestAnimationFrame || // Opera
            window.msRequestAnimationFrame || // IE
            function(callback, element) {
                window.setTimeout(callback, 170);
            };
    })();

    var onswiperight = function(delta) {

        deltaDif = Math.ceil(delta / (GESTURE_DELTA / 2));
        countFrames += deltaDif;
        animDirection = 1;
        if (!animatingFrames) {
            animatingFrames = true;
            animateFrames();
        }
    }
    var onswipeleft = function(delta) {
        deltaDif = deltaDif = Math.ceil(delta / (GESTURE_DELTA / 2));
        countFrames += deltaDif;
        animDirection = 2;

        if (!animatingFrames) {
            animatingFrames = true;
            animateFrames();
        }
    }
    var inGesture = false;

    var _originalX = 0;
    var _originalY = 0;

    var mousedown = function(event) {
        event.preventDefault();
        inGesture = true;
        _originalX = (event.touches) ? event.touches[0].pageX : event.pageX;
        _originalY = (event.touches) ? event.touches[0].pageY : event.pageY;

        // Only iphone
        if (event.touches && event.touches.length != 1) {
            inGesture = false;
        }
    }
    var mouseup = function() {
        inGesture = false;
    }
    var mousemove = function(event) {
        event.preventDefault();
        var delta = 0;
        var currentX = (event.touches) ? event.touches[0].pageX : event.pageX;
        var currentY = (event.touches) ? event.touches[0].pageY : event.pageY;

        if (inGesture) {

            if (direction == HORIZONTAL) {
                delta = Math.abs(currentY - _originalY);
            } else {
                delta = Math.abs(currentX - _originalX);
            }
            if (delta > AXIS_THRESHOLD) {
                //inGesture = false;
            }
        }

        if (inGesture) {
            if (direction == HORIZONTAL && !params.framesReverse) {
                delta = Math.abs(currentX - _originalX);
                if (currentX > _originalX) {
                    vDirection = 0;
                } else {
                    vDirection = 1;
                }
            } else if (direction == HORIZONTAL && params.framesReverse) {
                delta = Math.abs(currentX - _originalX);
                if (currentX < _originalX) {
                    vDirection = 0;
                } else {
                    vDirection = 1;
                }
            }else{
                delta = Math.abs(currentY - _originalY);
                if (currentY > _originalY) {
                    vDirection = 2;
                } else {
                    vDirection = 3;
                }
            }

            if (delta >= GESTURE_DELTA) {

                var handler = null;
                switch(vDirection) {
                    case 0:
                        handler = onswiperight;
                        break;
                    case 1:
                        handler = onswipeleft;
                        break;
                }
                if (handler != null) {
                    handler(delta);
                }
                _originalX = (event.touches) ? event.touches[0].pageX : event.pageX;
                _originalY = (event.touches) ? event.touches[0].pageY : event.pageY;
                //inGesture = false;
            }
        }
    }
    //***** End swipe detection Code

    var canvas = null;
    var context = null;

    var self = this;


    startPreload = function() {

        imageLogo = new Image();
        console.log(imageLogo);
        imageLogo.src = params.framesPath[1];
        imageLogo.onload = function() {
            logoWidth = imageLogo.width;
            logoHeight = imageLogo.height;

            logoX = ((params.canvasWidth - logoWidth) / 2);
            logoY = ((params.canvasHeight - logoHeight) / 2);

            var canvasCentreX = canvas.width / 2;
            var canvasCentreY = canvas.height / 2;
            var gradient = context.createRadialGradient(canvasCentreX, canvasCentreY, 250, canvasCentreX, canvasCentreY, 0);
            gradient.addColorStop(0, "rgb(0, 0, 0)");
            gradient.addColorStop(1, "rgb(125, 125, 125)");
            context.save();
            context.fillStyle = gradient;
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.restore();

            context.drawImage(imageLogo, logoX, logoY);
            context.strokeStyle = params.loaderBarColor;

            strokeX = logoX - 20;
            strokeY = logoY + logoHeight + 10;
            strokeWidth = logoWidth + 40;

            context.strokeRect(strokeX, strokeY, strokeWidth, strokeHeight);
            for ( i = 1; i < params.framesCount; i++) {
                frameImages[i] = new Image();
                // var repVal = ((i < 9) ? '0' : '') + (i + 1);
                console.log(frameImages[i]);
                frameImages[i].src = params.framesPath[i];
                console.log(frameImages[i].src);
            }
            setTimeout(function() {
                preloadImages();
            }, 20);
        }
        console.log(imageLogo);
    }
    var preloadImages = function() {

        for ( i = 0; i < params.framesCount; i++) {

            if (frameImages[i]) {
                loadPercent++;
            }
            loaderWidth = Math.ceil((strokeWidth - 2) * (loadPercent / 100));

        }
        if (!params.loaderFillGradient) {
            context.fillStyle = params.loaderFillColor;
        } else {

            gradient = context.createLinearGradient(strokeX + 1, strokeY + 1, loaderWidth, strokeHeight - 2);
            gradient.addColorStop(0, params.loaderFillColor);
            gradient.addColorStop(1, params.loaderFillColor2);
            context.save();
            context.fillStyle = gradient;
        }

        context.clearRect(strokeX + 1, strokeY + 1, loaderWidth, strokeHeight - 2);
        context.fillRect(strokeX + 1, strokeY + 1, loaderWidth, strokeHeight - 2);
        self = this;

        if (loadPercent >= params.framesCount) {
            // Done so draw and exit;
            drawFrame();
            return;
        } else {
            setTimeout(function() {
                preloadImages();
            }, 20);
        }

    }
    var animateFrames = function() {

        if (animDirection == 1) {
            curFrame++;
        }

        if (animDirection == 2) {
            curFrame--;
        }

        frameCount++;
        if (curFrame < 0) {
            curFrame = params.framesCount - 1;
        }
        if (curFrame > (params.framesCount - 1)) {
            curFrame = 0;
        }
        drawFrame();
        if (frameCount < countFrames) {

            requestAnimFrame(function() {
                animateFrames();
            });

        } else {
            animDirection = 0;
            countFrames = 0;
            frameCount = 0;
            animatingFrames = false;
        }

    }
    var drawFrame = function() {
        if (curFrame > (params.framesCount - 1)) {
            curFrame = 0;
        }
        if (curFrame < 0) {
            curFrame = (params.framesCount - 1);
        }

        // currentImage = frameImages[++curFrame];
        // console.log(curFrame);
        // if (curFrame >= 0 && curFrame < (params.framesCount - 1)) {
        //     context.drawImage(currentImage, imagePositionX, imagePositionY);
        // }
        if (animDirection == 1) {
            currentImage = frameImages[++curFrame];
            console.log(curFrame);
            console.log(currentImage);
            if(currentImage){
                context.drawImage(currentImage, imagePositionX, imagePositionY);
            }

        }

        if (animDirection == 2) {
            currentImage = frameImages[--curFrame];
            console.log(curFrame);
            console.log(222222);
            console.log(currentImage);
            if(currentImage){
                context.drawImage(currentImage, imagePositionX, imagePositionY);
            }
        }
    }
    if (params.canvasId) {
        // Set the variable elem to the object with the specified params.canvasId
        var elem = document.getElementById(params.canvasId);

        // If the element is not an object then show a message letting the user know.
        if (!elem) {
            alert('Invalid element ID.');
            return;
        } else {
            // Create a canvas object.
            canvas = document.createElement("canvas");

            // Set the canvas width to the width defined in the parameters.
            canvas.width = params.canvasWidth;

            // Set the actual height of the canvas object
            canvas.height = params.canvasHeight;

            // Add a class to the element where the canvas will be placed.
            elem.className += ' canvas360Wrapper';

            // Set the width of the div to match the width of the canvas.
            elem.style.width = ((canvas.width) + 'px');

            // Set the height of the div to match the height of the canvas.
            elem.style.height = ((canvas.height) + 'px');

            // Remove the existing HTML in the container element.
            elem.innerHTML = '';

            // Append the canvas to the element.
            elem.appendChild(canvas);

            // Define a context from the canvas.
            context = canvas.getContext('2d');

            // Set a mousedown event on the canvas.
            canvas.onmousedown = mousedown;

            // Map touchstart
            //canvas.addEventListener("touchstart", mousedown, false);
            canvas.ontouchstart = mousedown;

            // Set a mousemove event on the canvas.
            canvas.onmousemove = mousemove;

            // Map touchmove
            //canvas.addEventListener("touchmove", mousemove, false);
            canvas.ontouchmove = mousemove;

            // Set a keydown event on the canvas.
            window.onkeypress = function(event) {
                var k = event.keyCode || event.charCode;
                if (!k)
                    return;
                if (k == 37) {// left arrow
                    if(params.framesReverse) {
                        onswiperight();
                    } else {
                        onswipeleft();
                    }
                } else if (k == 39) {// right arrow
                    if(params.framesReverse) {
                        onswipeleft();
                    } else {
                        onswiperight();
                    }
                }
            }

            // Fix Andriod 4 Chrome bug.
            document.body.addEventListener('touchstart', function() {});

            // Set a mouseup event on the canvas.
            window.onmouseup = mouseup;

            // Start the preload method.
            startPreload();

        }

    }

}
canvas360();
$('#pop360').on('click', function(e) {
    console.log("dsd");
    e.preventDefault();
    canvas360({
        canvasId : 'canvas',
        canvasWidth : parseInt($(this).data('canvaswidth')),
        canvasHeight: parseInt($(this).data('canvasheight')),
    });
});
