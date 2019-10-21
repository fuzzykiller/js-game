/**
 * Load image
 * @param {string} url 
 * @returns {Promise<Image>}
 */
function loadImage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = url;
        image.onload = () => {
            resolve(image);
        }

        image.onerror = (err) => {
            reject(err);
        }
    })
}

function loadAudio(url) {
    return new Promise((resolve, reject) => {
        const audio = new Audio(url);
        audio.oncanplaythrough = () => {
            resolve(audio);
        }

        audio.onerror = (err) => {
            reject(err);
        }

        audio.on
    });
}

class Background {
    /**
     * 
     * @param {HTMLImageElement} image 
     */
    constructor(image) {
        this.image = image;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {
        context.drawImage(this.image, 0, 0, 1024, 512);
    }
}