onmessage = (ev) => {
    /**
     * @type {{
     *  gaps: {left: number, width: number}[],
     *  player: {left: number, width: number, isJumping: boolean}
     * }}
     */
    const data = ev.data;

    const { gaps, player } = data;

    if (player.isJumping) {
        return;
    }

    if (gaps.some(x => x.left <= player.left && (x.left + x.width) >= (player.left + player.width))) {
        postMessage(true);
    }
}