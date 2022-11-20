import { Decor } from './Decor.js';
import { Personnage } from './Personnage.js';
import detailanimeMai from '../assets/img/persos/Mai/detailanimeMai.js';
import detailanimeKing from '../assets/img/persos/King/detailanimeking.js';
import detailanimeSie from '../assets/img/persos/Sie Kensou/detailanimeSie.js';
import animebg from '../assets/img/bg/ruins/animebg.js';
import animebg2 from '../assets/img/bg/shion/animebg.js';
import animebg3 from '../assets/img/bg/alley/animebg.js';
import { Platform } from './Platform.js';
import { Color } from './Color.js';

export class Game {
  constructor(cnv) {
    this.canvas = cnv;
    this.context = cnv.getContext('2d');
    this.context.imageSmoothingEnabled = false;

    this.onResize();

    this.gridCol = 10;
    this.gridLig = 4;

    this.characters = [];
    this.background;
    this.gridBg;
    this.gridObj;
    this.gameOver = false;
    this.fps = 12;
    this._meanTimeFrame = 1000 / this.fps;
    this.timer;
    this.bgFolder = ['ruins', 'shion', 'alley'];
    this.nbFramesBg = [animebg.nbFrames, animebg2.nbFrames, animebg3.nbFrames];
    this.bgAnime = [animebg, animebg2, animebg3];

    this.allFilesQueued = false;
    this.loadingComplete = false;
    this.nbImagesLoaded = 0;
    this.nbImagesToLoad = 0;

    this.tileWidth = this.canvas.width / this.gridCol;
    this.tileHeight = this.canvas.height / this.gridLig;
    this.platforms = [];
    this.platformW = 128 / 2;
    this.platformH = 120 / 8;

    this._firstFrameTime = new Date();
    this.timeEllapsedSinceStartOfScene = 0;

    this._lastFrameTime = this._firstFrameTime;
    this.frameCount = 0;
    this.timeEllapsed = 0;
  }

  init() {
    const randBg = Math.floor(Math.random() * 3);
    this.background = new Decor(this.canvas, this.context, this.bgFolder[randBg], this.nbFramesBg[randBg], this.bgAnime[randBg]);

    let mai = new Personnage('Mai', 'Mai', 'Mai Shiranui_', 'L', 1, detailanimeMai, this.canvas, this.context);
    let king = new Personnage('King', 'King', 'King_', 'R', 2, detailanimeKing, this.canvas, this.context);
    let king2 = new Personnage('King', 'King', 'King_', 'R', 2, detailanimeKing, this.canvas, this.context);
    let king3 = new Personnage('King', 'King', 'King_', 'R', 2, detailanimeKing, this.canvas, this.context);
    let calum = new Personnage('Sie Kensou', 'Sie Kensou', 'Sie Kensou_', 'R', 2, detailanimeSie, this.canvas, this.context);
    this.characters.push(mai);
    this.characters.push(king);
    this.characters.push(king2);
    this.characters.push(king3);
    this.characters.push(calum);

    this.loadImages();
    this.generatePlatforms();
  }

  clearCanvas(color) {
    this.context.fillStyle = color;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  loadImages() {
    for (let i = 0; i < this.background.nbBgFrames; i++) {
      const img = new Image();

      img.onload = () => this.increaseImagesLoaded();
      img.onerror = () => this.increaseImagesLoaded();

      if (i === this.background.nbBgFrames - 1) {
        this.allFilesQueued = true;
      }
      this.nbImagesToLoad++;
      img.src = `assets/img/bg/${this.background.bgFolder}/frame_${i.toString().padStart(2, '0')}.png`;
      this.background.bgLayers.push(img);
    }
  }

  increaseImagesLoaded() {
    this.nbImagesLoaded++;

    if (!this.allFilesQueued) return;

    if (this.nbImagesLoaded === this.nbImagesToLoad) {
      this.loadingComplete = true;
    }
  }

  onResize() {
    const baseW = 640;
    const baseH = 480;

    const ratioW = innerWidth / baseW;
    const ratioH = innerHeight / baseH;
    const ratio = Math.min(ratioW, ratioH);
    const w = baseW * ratio;
    const h = baseH * ratio;

    this.canvas.width = w;
    this.canvas.height = h;

    if (this.background) {
      this.background._onResize();
    }

    if (this.characters) {
      for (let character of this.characters) {
        character._onResize();
      }
    }

    if (this.platforms) {
      for (let platform of this.platforms) {
        platform._onResize();
      }
    }
  }

  idle() {
    if (!this.loadingComplete) return;

    this.background._update();

    for (let character of this.characters) {
      character._update();

      if (character.kO) {
        // restart dans 1s
        this.resDefer();
      }
    }
  }

  draw() {
    this.loadingComplete ? this.drawScene() : this.drawLoadingScreen();
  }

  drawLoadingScreen() {
    this.clearCanvas('black');

    const nbDots = Math.floor((this.timeEllapsedSinceStartOfScene * 3 / 1000)) % 3 + 1;
    const dots = Array(nbDots).fill('.').join('');

    this.context.font = '20px sans-serif';
    this.context.fillStyle = 'white';
    this.context.fillText('Chargement' + dots, this.canvas.width / 2 - 100, this.canvas.height / 2 - 20);

    this.context.fillStyle = '#00FF00';
    this.context.fillRect(this.canvas.width / 2 - 100, this.canvas.height / 2 - 10, 200 * (this.nbImagesLoaded / this.nbImagesToLoad), 20);
  }

  drawScene() {
    this.clearCanvas('white');
    this.background._draw();
    this.drawPlatforms();
    //this.gridObj.drawObj();                                 // Dessine Item
    //console.log(this.gridObj);
    /* for (let player of this.tabPlayer) {
        this.gridBg.setCellGrid(player, player.codePlayer);
    } */
    //this.gridBg.enemyClose();
    for (let character of this.characters) {
      character._draw();                                      // Dessine perso
    }
  }

  start() {
    const draw = () => {
      const time = new Date();
      const timeEllapsed = time - this._lastFrameTime;

      if (timeEllapsed >= this._meanTimeFrame)
      {
        this.frameCount++;

        this.timeEllapsed = timeEllapsed;
        this._lastFrameTime = time;

        this.timeEllapsedSinceStartOfScene = time - this._firstFrameTime;

        this.idle();
        this.draw();
      }

      requestAnimationFrame(() => draw());
    };
    requestAnimationFrame(() => draw());
    // this.timer = setInterval(() => draw());
  }

  resDefer() {
    setTimeout(this.restart, 1000);
  }

  pause() {
    clearInterval(this.timer);
  }

  restart() {
    this.timestamp = 90;
    window.document.location.reload();
  }

  /* Procedural Platform */
  generatePlatforms() {
    const positions = [];
    for (let i = 0; i < 16; i++) {
      let x = null;
      let y = null;

      do {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 3);
      } while(positions.find(p => p.y === y && p.x === x));

      positions.push({ x, y });
    }

    const startColor = new Color('white');
    const endColor = new Color('magenta');

    this.platforms = positions.map(pos => {
      const platform = new Platform(this.canvas, this.context);
      platform.setGridPosition(pos.x, pos.y);
      platform.color = Color.lerp(startColor, endColor, platform.position.y / this.canvas.height);

      return platform;
    });
  }

  drawPlatforms() {
    for (let platform of this.platforms) {
      platform._draw();
    }
  }
}