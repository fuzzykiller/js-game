class Player {
    stepChangeInterval = 200;

    width = 108;
    height = 155;
    left = 0;
    top = 202;

    /**
     * @type {'idle' | 'running' | 'jumping'}
     */
    currentState = 'idle';
    currentStep = 0;

    previousStepChangeTime = 0;

    dying = false;

    /**
     * @type {Record<
     *  'idle' | 'running' | 'jumping',
     *  { image: HTMLImageElement, steps: number}
     * >}
     */
    images;

    /**
     * 
     * @param {HTMLImageElement} idleImage 
     * @param {HTMLImageElement} runningImage
     * @param {HTMLImageElement} jumpingImage
     * @param {HTMLAudioElement} jumpSnd
     * @param {HTMLAudioElement} dropSnd
     */
    constructor(idleImage, runningImage, jumpingImage,
        jumpSnd, dropSnd) {
        this.images = {
            'idle': { image: idleImage, steps: 4 },
            'running': { image: runningImage, steps: 6 },
            'jumping': { image: jumpingImage, steps: 8 }
        };

        this.jumpSnd = jumpSnd;
        this.dropSnd = dropSnd;
    }

    die() {
        if (this.dying) {
            return;
        }

        this.dying = true;

        this.dropSnd.currentTime = 0;
        this.dropSnd.play();
    }

    /**
     * 
     * @param {number} time 
     * @param {boolean} enterPressed
     * @param {boolean} spacePressed
     */
    update(time, enterPressed, spacePressed) {
        if (this.dying) {
            this.top += Math.sqrt(this.top - 200) / 2;
            if (this.currentState !== 'running') {
                this.currentState = 'running';
                this.currentStep = 0;
                this.previousStepChangeTime = time;
            }
        } else if (this.currentState === 'jumping') {
            // continue jumping
        } else if (spacePressed) {
            this.currentState = 'jumping';
            this.currentStep = 0;
            this.previousStepChangeTime = time;
            this.top -= 55;

            this.jumpSnd.currentTime = 0;
            this.jumpSnd.play();
        } else if (this.currentState === 'running' && enterPressed) {
            // keep running
        } else if (enterPressed) {
            this.currentState = 'running';
            this.currentStep = 0;
            this.previousStepChangeTime = time;
        } else if (this.currentState !== 'idle') {
            this.currentState = 'idle';
            this.currentStep = 0;
            this.previousStepChangeTime = time;
        }

        const passedTime = time - this.previousStepChangeTime;
        if (passedTime > this.stepChangeInterval) {
            const visibleSteps = this.images[this.currentState].steps;
            const passedSteps = Math.floor(passedTime / this.stepChangeInterval);
            this.currentStep = (this.currentStep + passedSteps) % visibleSteps;

            this.previousStepChangeTime = time;

            if (this.currentState === 'jumping' && this.currentStep === 0 && !spacePressed) {
                // stop jumping
                this.currentState = enterPressed ? 'running' : 'idle';
                this.top += 55;
            }
        }
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {
        const image = this.images[this.currentState];
        const sliceWidth = image.image.width / image.steps;
        const sliceLeft = sliceWidth * this.currentStep;
        context.drawImage(image.image, sliceLeft, 0, sliceWidth, 464, this.left, this.top, this.width, this.height);
    }
}