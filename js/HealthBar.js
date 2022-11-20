import { Color } from './Color.js';
import { GameObject } from './GameObject.js';

export class HealthBar extends GameObject {

  constructor(canvas, context) {
    super(canvas, context);

    this.hp = 1;
    this.hpMax = 1;

    this.barSize = 100;
  }

  draw() {
    const map = (v, srcMin, srcMax, dstMin, dstMax) => {
      return (v - srcMin) * (dstMax - dstMin) / (srcMax - srcMin) + dstMin;
    };

    // Background
    this.context.fillStyle = '#000';
    this.context.beginPath();
    this.context.moveTo(0, 10);
    this.context.lineTo(5, 0);
    this.context.lineTo(this.barSize, 0);
    this.context.lineTo(this.barSize - 5, 10);
    this.context.closePath();
    this.context.fill();

    // Life
    const lifeRatio = this.hp / this.hpMax;
    const red = new Color(255, 0, 0);
    const orange = new Color(255, 176, 0);
    const yellow = new Color(255, 255, 0);
    const green = new Color(85, 255, 85);

    if (lifeRatio > 0.66)
      this.context.fillStyle = Color.lerp(yellow, green, (lifeRatio - 0.66) * 3).toString();
    else if (lifeRatio > 0.33)
      this.context.fillStyle = Color.lerp(orange, yellow, (lifeRatio - 0.33) * 3).toString();
    else
      this.context.fillStyle = Color.lerp(red, orange, lifeRatio * 3).toString();

    this.context.beginPath();
    this.context.moveTo(0, 10);
    const x = Math.round(lifeRatio * this.barSize);
    if (x <= 5) {
      const y = map(x, 0, 5, 10, 0);
      this.context.lineTo(x, y);
      this.context.lineTo(x, 10);
    } else if (x < this.barSize - 5) {
      //console.clear();
      //console.log(x)
      this.context.lineTo(5, 0);
      this.context.lineTo(x, 0);
      this.context.lineTo(x, 10);
    } else {
      const y = map(x, this.barSize - 5, this.barSize, 10, 0);
      this.context.lineTo(5, 0);
      this.context.lineTo(x, 0);
      this.context.lineTo(x, y);
      this.context.lineTo(this.barSize - 5, 10);
    }
    this.context.closePath();
    this.context.fill();

    // Reflet
    this.context.fillStyle = '#fff8';
    this.context.beginPath();
    this.context.moveTo(2, 6);
    this.context.lineTo(4, 2);
    this.context.lineTo(this.barSize - 1, 2);
    this.context.lineTo(this.barSize - 3, 6);
    this.context.closePath();
    this.context.fill();

    // Border
    this.context.strokeStyle = '#000';
    this.context.lineWidth = 2;
    this.context.beginPath();
    this.context.moveTo(0, 10);
    this.context.lineTo(5, 0);
    this.context.lineTo(this.barSize, 0);
    this.context.lineTo(this.barSize - 5, 10);
    this.context.closePath();
    this.context.stroke();
  }

}