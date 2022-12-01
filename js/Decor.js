import { GameObject } from './GameObject.js';

// CLASSE PRINCIPALE
export class Decor extends GameObject {
  constructor(canvas, context, animation) {
    super(canvas, context);

    this.animation = animation;

    this.onResize();
  }

  onResize() {
    if (!this.animation.currentImage) return;

    const ratioW = this.canvas.width / this.animation.currentImage.width;
    const ratioH = this.canvas.height / this.animation.currentImage.height;
    const ratio = Math.max(ratioW, ratioH);
    this.w = this.animation.currentImage.width * ratio;
    this.h = this.animation.currentImage.height * ratio;

    this.setPosition(this.canvas.width / 2, this.canvas.height / 2);
  }

  /* Dessin Background */
  draw() {
    this.context.drawImage(
      this.animation.currentImage,
      0, 0, this.animation.currentImage.width, this.animation.currentImage.height,
      -this.w / 2, -this.h / 2, this.w, this.h);
  }

  /* Animation du Background */
  update() {
    this.animation.update();
  }
}
