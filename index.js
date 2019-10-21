/**
 * @returns {Promise<HTMLImageElement[]>}
 */
function getImages() {
  const background = loadImage('assets/background2.png');
  const platform = loadImage('assets/platform.png');
  const sheepIdle = loadImage('assets/Black_Sheep_Idle.png');
  const sheepRun = loadImage('assets/Black_Sheep_Run.png');
  const sheepJump = loadImage('assets/Black_Sheep_Jump.png');

  return Promise.all([background, platform, sheepIdle, sheepRun, sheepJump]);
}

function getSounds() {
  const jump = loadAudio('audio/jump1.wav');
  const drop = loadAudio('audio/drop.wav');

  return Promise.all([jump, drop]);
}

async function init() {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById('sheep-n-run');
  const context = canvas.getContext('2d');

  const [backgroundImg, platformImg, idleImg, runImg, jumpImg] = await getImages();
  const [jumpSnd, dropSnd] = await getSounds();

  const background = new Background(backgroundImg);
  const platforms = new Platforms([
    new Platform(platformImg, 0),
    new Gap(200),
    new Platform(platformImg, 400),
    new Platform(platformImg, 600),
    new Platform(platformImg, 800),
    new Gap(1000),
    new Platform(platformImg, 1200),
    new Platform(platformImg, 1400),
    new Gap(1600),
    new Platform(platformImg, 1800),
    new Platform(platformImg, 2000),
    new Platform(platformImg, 2200)
  ]);

  const player = new Player(idleImg, runImg, jumpImg, jumpSnd, dropSnd);
  const loop = new Loop(context, background, player, platforms);

  window.addEventListener('keydown', x => {
    if (x.key == "Enter") {
      loop.enterPressed = true;
    }

    if (x.key == " ") {
      loop.spacePressed = true;
    }
  });

  window.addEventListener('keyup', x => {
    if (x.key == "Enter") {
      loop.enterPressed = false;
    }

    if (x.key == " ") {
      loop.spacePressed = false;
    }
  });

  requestAnimationFrame(time => loop.step(time));
}

document.addEventListener('DOMContentLoaded', () => {
  init().catch(console.error);
});