class Base {
    width = 200;
    left = -1;

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {
    }
}

class Platform extends Base {
    height = 130;
    top = 282;

    /**
     * 
     * @param {HTMLImageElement} image 
     * @param {number} left 
     */
    constructor(image, left) {
        super();

        this.image = image;
        this.left = left;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {
        context.drawImage(this.image, this.left, this.top, this.width, this.height);
    }
}

class Gap extends Base {
    constructor(left) {
        super();

        this.left = left;
    }
}

class Platforms {
    moveLeftInterval = 35;
    moveLeftOffset = 5;

    previousMoveLeftTime = 0;

    /**
     * @type {Platform[]}
     */
    platforms;

    /**
     * 
     * @param {Platform[]} platforms 
     */
    constructor(platforms) {
        this.platforms = platforms;
    }

    get gaps() {
        return this.platforms.filter(x => x instanceof Gap);
    }

    /**
     * 
     * @param {Player} player 
     */
    isOverGround(player) {
        const firstPlatform = this.platforms.find(p => p.left < player.left && (p.left + p.width) > player.left);
        const secondPlatform = this.platforms.find(p => p.left < (player.left + player.width) && (p.left + p.width) > (player.left + player.width));

        return !(firstPlatform instanceof Gap && secondPlatform instanceof Gap);
    }

    /**
     * 
     * @param {number} time 
     * @param {boolean} enterPressed
     */
    update(time, enterPressed) {
        if (!enterPressed) {
            // not moving
            this.previousMoveLeftTime = time;
            return;
        }

        const passedTime = time - this.previousMoveLeftTime;
        const shouldMoveLeft = passedTime > this.moveLeftInterval;

        if (shouldMoveLeft) {
            const passedOffsets = Math.floor(passedTime / this.moveLeftInterval);
            const offset = passedOffsets * this.moveLeftOffset;
            this.platforms.forEach(p => p.left -= offset);

            this.previousMoveLeftTime = time;
        }

        const firstVisiblePlatformIndex = this.platforms.findIndex(p => p.left > -p.width);
        const reorderedPlatforms = [...this.platforms.slice(firstVisiblePlatformIndex), ...this.platforms.slice(0, firstVisiblePlatformIndex)];

        for (let i = 1; i < reorderedPlatforms.length; i++) {
            const previousPlatform = reorderedPlatforms[i - 1];
            const currentPlatform = reorderedPlatforms[i];
            currentPlatform.left = previousPlatform.left + previousPlatform.width;
        }

        this.platforms = reorderedPlatforms;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {
        this.platforms.forEach(p => p.draw(context));
    }
}