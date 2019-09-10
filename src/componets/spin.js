import './index.styl'
import {images} from './images.js'


export default class Spin360 {
    constructor(el) {
        this.el = el;
        this.progressBar;
        this.settings = {
            frameImages: {},
            framesPath: window.innerWidth < 768 && images[500] ? images[500] : images[1000],
            framesLength: Object.keys(images[500]).length,
        }
        this.canvasSettings = {
            height: window.innerWidth < 768 ? 250 : 500,
            width: window.innerWidth < 768 ? 250 : 500,
            dy: 0,
            dx: 0,
        }
        this.canvas = document.createElement("canvas");
        this.ctx;
        this.frame = {
            direction: 1,
            curFrame: 0,
            count: 0,
            spin: 40,
            animating: false,
            swipe: false,
            tick: 50,
            inertionTick: 1,
            delta: 8,

        };
        this.init();
    }

    init() {
        this.progressBarInit();
        this.loadImage();
        this.swipeCanvasHandler()
    }

    progressBarInit() {
        this.progressBar = ` 
		 <div class="progress-bar" >
			<div class="progress-line"></div>
		</div>
	`
        this.el.innerHTML = this.progressBar;
    }

    loadImage() {
        let loadPercent = 0;
        const progressBarLoad = (number) => {
            const progressLine = this.el.querySelector(".progress-line");
            if (progressLine) {
                progressLine.style.width = `${(number / 52) * 100}%`;
            }
        };
        const preloadImages = () => {
            if (loadPercent < this.settings.framesLength) {
                this.settings.frameImages[loadPercent] = new Image();
                this.settings.frameImages[loadPercent].src = this.settings.framesPath[loadPercent];
                this.settings.frameImages[loadPercent].onload = () => {
                    setTimeout(() => {
                        preloadImages();
                        progressBarLoad(loadPercent);
                        loadPercent++;
                    });
                }
            } else {
                this.canvasCreated();
                this.spinCanvas();
                setTimeout(() => {
                    this.imageClickHandler()
                }, 1500)
            }

        };
        preloadImages();

    }

    imageClickHandler() {
        let handImage = document.createElement("div");
        handImage.classList.add("icon-spin");
        this.el.appendChild(handImage);
        setTimeout(()=>{
            handImage.remove()
        },5000)
    }

    canvasCreated() {
        this.canvas.id = "canvas";
        this.canvas.width = this.canvasSettings.width;
        this.canvas.height = this.canvasSettings.height;
        this.ctx = this.canvas.getContext('2d');
        this.el.innerHTML = "";
        this.el.appendChild(this.canvas);
    }

    spinCanvas() {
        let currentImage;
        const animateFrames = () => {
            if (this.frame.direction === 2) {
                this.frame.curFrame--;
            } else {
                this.frame.curFrame++;
            }
            this.frame.count++;
            drawFrame();
            if (this.frame.count < this.frame.spin) {
                this.frame.swipe = false;
                const setTick = () => {
                    this.frame.tick = this.frame.tick + 2;
                    this.frame.inertionTick = (this.frame.tick / this.frame.delta) * 3;
                };
                setTick();

                setTimeout(() => {
                    animateFrames();
                }, this.frame.inertionTick);

            } else {
                this.frame.count = 0;
                this.frame.direction = 0;
                this.frame.swipe = true;
                this.frame.animating = false;
            }
        };

        const drawFrame = () => {
            if (this.frame.curFrame < 0) {
                this.frame.curFrame = (this.settings.framesLength - 1);
            }
            if (this.frame.curFrame > (this.settings.framesLength - 1)) {
                this.frame.curFrame = 0;
            }
            if (this.frame.direction === 1) {
                currentImage = this.settings.frameImages[this.frame.curFrame];
                if (currentImage) {
                    this.ctx.drawImage(currentImage, this.canvasSettings.dx, this.canvasSettings.dy, this.canvasSettings.width, this.canvasSettings.height);
                }
            }
            if (this.frame.direction === 2) {
                currentImage = this.settings.frameImages[this.frame.curFrame];
                if (currentImage) {
                    this.ctx.drawImage(currentImage, this.canvasSettings.dx, this.canvasSettings.dy, this.canvasSettings.width, this.canvasSettings.height);
                }
            }

        };
        animateFrames();
    }

    swipeCanvasHandler() {
        console.log("hadler");
        const swipe = {
            dataStart: Date.now(),
            patch: {
                coords: [],
            },
            currentX: "",
            inGesture: false,
            originalX: "",
            firstX: "",
            resultDate: "",
            repeat: false,
            startSpin: false,
        };
        const setCordinate = (a, b) => {
            let delta, vDirection;
            if (swipe.inGesture) {
                delta = Math.abs(b - a);
                if (a > b) {
                    vDirection = 1;
                }
                if (a < b) {
                    vDirection = 0;
                }
                let handler = null;
                switch (vDirection) {
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
            }
        };
        const onswiperight = (delta) => {
            if (swipe.repeat) {
                this.frame.spin = 100;
                swipe.inGesture = false;
            } else {
                this.frame.spin = 15;
            }
            this.frame.direction = 1;
            if (!this.frame.animating) {
                this.frame.animating = true;
                setTimeout(() => {
                    this.spinCanvas();
                }, this.frame.inertionTick);
            }


        };
        const onswipeleft = (delta) => {
            if (swipe.repeat) {
                this.frame.spin = 100;
                swipe.inGesture = false;
            } else {
                this.frame.spin = 15;
            }
            this.frame.direction = 2;
            if (!this.frame.animating) {
                this.frame.animating = true;
                setTimeout(() => {
                    this.spinCanvas();
                }, this.frame.inertionTick);
            }

        };

        const canvasStart = (e) => {
            if (!swipe.startSpin) {
                swipe.dataStart = Date.now();
                swipe.path = {coords: null};
                swipe.currentX = {};
                swipe.inGesture = true;
                swipe.firstX = (e.touches) ? e.touches[0].pageX : e.pageX;
                this.canvas.ontouchmove = function (e) {
                    canvasMove(e);
                };
                this.canvas.onmousemove = function (e) {
                    canvasMove(e);
                }
            }

        };
        const canvasMove = (e) => {
            if (swipe.inGesture) {
                let dataMove = Date.now();
                let resultDate = dataMove - swipe.dataStart;
                swipe.path.coords = swipe.path.coords || [];
                swipe.currentX = (e.touches) ? e.touches[0].pageX : e.pageX;
                swipe.path.coords.push(swipe.currentX);
                this.frame.inertionTick = 30;
                let corLength = swipe.path.coords.length;
                swipe.originalX = swipe.path.coords[corLength - 2];
                if (swipe.currentX !== swipe.originalX && !!swipe.originalX && resultDate > 50) {
                    swipe.repeat = false;
                    this.frame.swipe = true;
                    setCordinate(swipe.currentX, swipe.originalX);
                }
            }
        };
        const canvasEnd = (e) => {
            if (swipe.inGesture) {
                if (swipe.currentX > swipe.originalX && swipe.originalX !== swipe.currentX || swipe.currentX < swipe.originalX && swipe.originalX !== swipe.currentX) {
                    this.frame.tick = 10;
                    this.frame.swipe = false;
                    swipe.repeat = true;
                    setCordinate(swipe.currentX, swipe.originalX);
                }
            }
            swipe.inGesture = false;
            swipe.startSpin = false;
        };

        this.canvas.addEventListener("touchstart", (e) => {
            e.preventDefault();
            e.stopPropagation();
            canvasStart(e);
        })
        this.canvas.addEventListener("mousedown", (e) => {
            e.preventDefault();
            e.stopPropagation();
            canvasStart(e);
        })
        this.canvas.addEventListener("touchend", (e) => {
            e.preventDefault();
            e.stopPropagation();
            canvasEnd(e)
        })
        this.canvas.addEventListener("mouseup", (e) => {
            e.preventDefault();
            e.stopPropagation();
            canvasEnd(e)
        })


    }
}
