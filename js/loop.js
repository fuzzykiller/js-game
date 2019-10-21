class Loop {
    enterPressed = false;
    spacePressed = false;

    /**
     * 
     * @param {CanvasRenderingContext2D} context
     * @param {Background} background
     * @param {Player} player 
     * @param {Platforms} platforms
     */
    constructor(context, background, player, platforms) {
        this.context = context;
        this.background = background;
        this.player = player;
        this.platforms = platforms;
    }

    /**
     * 
     * @param {number} time 
     */
    update(time) {
        this.player.update(time, this.enterPressed, this.spacePressed);
        const isJumping = this.player.currentState === 'jumping';

        if (!this.player.dying) {
            this.platforms.update(time, this.enterPressed);
        }

        const isOverGround = this.platforms.isOverGround(this.player, this.platforms);
        if (!isOverGround && !isJumping) {
            this.player.die();
        }
    }

    render() {
        this.background.draw(this.context);
        this.platforms.draw(this.context);
        this.player.draw(this.context);
    }

    /**
     * 
     * @param {number} time 
     */
    step(time) {
        this.update(time);
        this.render();

        requestAnimationFrame(x => this.step(x));
    }
}