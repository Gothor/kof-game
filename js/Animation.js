export class Animation {

  constructor(name) {
    this.name = name;
    this.images = [];
    this.current = 0;
  }

  get currentImage() { return this.images[this.current]; };

  update() {
    this.current = (this.current + 1) % this.images.length;
  }

}