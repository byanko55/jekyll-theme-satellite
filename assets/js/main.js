document.addEventListener('DOMContentLoaded', function () {
    const scroller = new SweetScroll({
        /* some options */
    });

    // Scroll-Down/Down-Button-Click Event 
    var btn_on;

    // Check scroll position for every 0.25 sec
    setInterval(function(){
        var scroll_pos = document.documentElement.scrollTop;

        if (scroll_pos == 0){
            btn_on = true;
        }
        else {
            btn_on = false;
        }

        toggleButton();
    }, 250);

    function toggleButton(){
        var down_btn = document.querySelector('#about-down');
        var about_page = document.querySelector('#about');

        if (btn_on) {
            down_btn.classList.add('btn-open');
            about_page.classList.remove('fold');
        }
        else {
            down_btn.classList.remove('btn-open');
            about_page.classList.add('fold');
        }
    }

    // Bubble Effect
    class bubble {
        constructor(canvasWidth, canvasHeight) {
            this.maxHeight = canvasHeight;
            this.maxWidth = canvasWidth;
            this.randomise();
        }

        generateDecimalBetween(min, max) {
            return (Math.random() * (min - max) + max).toFixed(2);
        }

        update() {
            this.posX = this.posX - this.movementX;
            this.posY = this.posY - this.movementY;
        
            if (this.posY < 0 || this.posX < 0 || this.posX > this.maxWidth) {
                this.randomise();
                this.posY = this.maxHeight;
            }
        }

        randomise() {
            this.size = this.generateDecimalBetween(3, 5);
            this.movementX = this.generateDecimalBetween(-0.4, 0.4);
            this.movementY = this.generateDecimalBetween(0.7, 2);
            this.posX = this.generateDecimalBetween(0, this.maxWidth);
            this.posY = this.generateDecimalBetween(0, this.maxHeight);
        }
    }

    class background {
        constructor() {
            this.canvas = document.querySelector('#bubbles');
            this.ctx = this.canvas.getContext("2d");
            this.canvas.height = window.innerHeight;
            this.canvas.width = window.innerWidth;
            this.bubblesList = [];
            this.generateBubbles();
            this.animate();
        }

        animate() {
            let self = this;
            self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
            self.bubblesList.forEach(function(bubble) {
                bubble.update();
                self.ctx.beginPath();
                self.ctx.arc(bubble.posX, bubble.posY, bubble.size, 0, 2 * Math.PI);
                self.ctx.fillStyle = "rgb(255, 232, 176)";
                self.ctx.fill();
                self.ctx.strokeStyle = "rgb(255, 232, 176)";
                self.ctx.stroke();
            });

            self.ctx.globalCompositeOperation='destination-over';

            requestAnimationFrame(this.animate.bind(this));
        }

        addBubble(bubble) {
            return this.bubblesList.push(bubble);
        }

        generateBubbles() {
            let self = this;

            for (let i = 0; i < self.bubbleDensity(); i++) {
              self.addBubble(new bubble(self.canvas.width, self.canvas.height));
            }
        }

        bubbleDensity() {
            return Math.sqrt((this.canvas.height, this.canvas.width));
        }
    }

    const bubbles = new background();

    window.requestAnimFrame = (function() {
        return (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 100);
            }
        );
    })();
});
