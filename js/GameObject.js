import { Vector2 } from './Vector2.js';

export class GameObject {

  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.position = new Vector2();
    this.parent = null;
    this.children = [];
  }

  setParent(object) {
    if (object && !(object instanceof GameObject)) {
      throw 'parameter object is not an instance of GameObject';
    }

    if (this.parent !== null) {
      const index = this.parent.children.indexOf(this);
      this.parent.splice(index, 1);
    }

    this.parent = object;

    if (object !== null) {
      this.parent.children.push(this);
    }
  }

  addChild(object) {
    if (object && !(object instanceof GameObject)) {
      throw 'parameter object is not an instance of GameObject';
    }

    object.setParent(this);
  }

  setPosition(x, y) {
    this.position.set(x, y);
  }

  _update() {
    if (this.update) {
      this.update();
    }
  }

  _draw() {
    this.context.save();
    this.context.translate(this.position.x, this.position.y);

    if (this.draw) {
      this.context.save();
      this.draw();
      this.context.restore();
    }

    for (let child of this.children) {
      child._draw();
    }

    this.context.restore();
  }

  _onResize() {
    if (this.onResize) {
      this.onResize();
    }

    for (let child of this.children) {
      child._onResize();
    }
  }

}