import { GameObject } from './GameObject.js';

// CLASSE PRINCIPALE
export class Decor extends GameObject {
  constructor(canvas, context, bgFolder, bgFramesNb, detailAnime) {
    super(canvas, context);

    this.bgFolder = bgFolder;
    this.bgLayers = [];
    this.nbBgFrames = bgFramesNb;
    this.imgId = 0;
    this.animeDetail = detailAnime;

    this.onResize();
  }

  onResize() {
    if (!this.bgLayers[this.imgId]) return;

    const ratioW = this.canvas.width / this.bgLayers[this.imgId].width;
    const ratioH = this.canvas.height / this.bgLayers[this.imgId].height;
    const ratio = Math.max(ratioW, ratioH);
    this.w = this.bgLayers[this.imgId].width * ratio;
    this.h = this.bgLayers[this.imgId].height * ratio;

    this.setPosition(this.canvas.width / 2, this.canvas.height / 2);
  }

  /* Dessin Background */
  draw() {
    this.context.drawImage(
      this.bgLayers[this.imgId],
      0, 0, this.bgLayers[this.imgId].width, this.bgLayers[this.imgId].height,
      -this.w / 2, -this.h / 2, this.w, this.h);
  }

  /* Animation du Background */
  update() {
    this.imgId++;
    if (this.imgId > this.animeDetail.animations[0].end) {
      this.imgId = this.animeDetail.animations[0].start;
    }

    if (this.w === undefined) this.onResize();
  }
}
