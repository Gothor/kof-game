export class Vector2 {

  constructor(x, y) {
    if (
      x === undefined
      || y === undefined
      || typeof(x) !== 'number'
      || typeof(y) !== 'number'
    ) {
      this.x = 0;
      this.y = 0;

      return;
    }

    this.x = x;
    this.y = y;
  }

  set(x, y) {
    if (
      y === undefined
      || typeof(y) !== 'number'
    ) {
      throw 'parameter y is not a number';
    }

    if (
      x === undefined
      || typeof(x) !== 'number'
    ) {
      throw 'parameter x is not a number';
    }

    this.x = x;
    this.y = y;
  }

}