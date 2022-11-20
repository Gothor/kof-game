import { GameObject } from './GameObject.js';
import { Vector2 } from './Vector2.js';

export class Platform extends GameObject {

  constructor(canvas, context) {
    super(canvas, context);

    this.tileWidth = null;
    this.tileHeight = null;
    this.platformWidth = null;
    this.platformHeight = null;

    this.gridPosition = new Vector2();

    this.color;

    this.onResize();
  }

  draw() {
    this.context.fillStyle = this.color;

    this.context.fillRect(0, 0, this.platformWidth, this.platformHeight);
    this.context.strokeRect(0, 0, this.platformWidth, this.platformHeight);
  }

  setGridPosition(column, row) {
    this.gridPosition.set(column, row);
    this.updatePosition();
  }

  updatePosition() {
    this.position.x = this.gridPosition.x * this.tileWidth;
    this.position.y = this.gridPosition.y * this.tileHeight + this.tileHeight;
  }

  onResize() {
    this.tileWidth = this.canvas.width / 10;
    this.tileHeight = this.canvas.height / 4;

    this.platformWidth = this.tileWidth;
    this.platformHeight = this.tileHeight / 8;

    this.updatePosition();
  }

}