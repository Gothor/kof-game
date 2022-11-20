// COULEUR RGB
export class Color {
  constructor(color, g, b, a) {
    let r = color;

    if (typeof(color) === 'string') {
      Color._context.fillStyle = color;
      let hexa = Color._context.fillStyle;

      r = parseInt(hexa.substring(1, 3), 16);
      g = parseInt(hexa.substring(3, 5), 16);
      b = parseInt(hexa.substring(5, 7), 16);
    }

    if (a === undefined) {
      a = 255;
    }

    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  toString() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }

  static _context = document.createElement('canvas').getContext('2d');

  static lerp(c1, c2, ratio) {
    const r = Math.round((c2.r - c1.r) * ratio + c1.r);
    const g = Math.round((c2.g - c1.g) * ratio + c1.g);
    const b = Math.round((c2.b - c1.b) * ratio + c1.b);

    return new Color(r, g, b);
  }
}