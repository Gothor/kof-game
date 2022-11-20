import { GameObject } from './GameObject.js';
import { HealthBar } from './HealthBar.js';
import { Vector2 } from './Vector2.js';

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
}

// PERSONNAGE
export class Personnage extends GameObject {
  constructor(name, assetsFolder, imgNamePng, startPosition, codePlayer, json, canvas, context) {
    super(canvas, context);

    this.name = name;
    this.codePlayer = codePlayer;
    this.hp = 100;
    this.hpMax = 100;
    this.assetsFolder = assetsFolder;
    this.imgNamePng = imgNamePng;
    this.assets = [];
    this.detail = json;
    this.imgId = 0;
    this.canMove = true;
    this.dirMove = 4;
    this.actionNum = 0;
    this.onAction = false;
    this.onHit = false;
    this.kO = false;
    this.facingRight = startPosition === 'L';

    this.gridPosition = new Vector2();

    this.tileWidth = null;
    this.tileHeight = null;

    if (startPosition === 'L') {
      this.setGridPosition(2, 3);
    } else {
      let col = random(5, 10);
      let row = random(0, 4);

      this.setGridPosition(col, row);
    }

    this.healthBar = new HealthBar(canvas, context);
    this.healthBar.setParent(this);

    this.loadImg();
    this.onResize();
  }

  update() {
    this.hp -= 1;
    if (this.hp < 0) {
      this.hp = 0;
    }

    this.healthBar.hpMax = this.hpMax;
    this.healthBar.hp = this.hp;

    this.animeRandom();
    this.move();
  }

  loadImg() {
    for (let i = 0; i < this.detail.nbFrames; i++) {
      this.img = new Image();
      this.img.src = `assets/img/persos/${this.assetsFolder}/${this.imgNamePng}${i}.png`;
      this.assets.push(this.img);
    }
  }

  setGridPosition(column, row) {
    this.gridPosition.set(column, row);
    this.updatePosition();
  }

  updatePosition() {
    this.position.x = this.gridPosition.x * this.tileWidth;
    this.position.y = this.gridPosition.y * this.tileHeight;
  }

  setDirMove(val) {
    this.dirMove = val;
  }

  draw() {
    const currentRatio = this.canvas.width / 640;

    // Tailles dynamiques en fonction du sprite
    let sizeSpriteW = this.assets[this.imgId].width * currentRatio;
    let sizeSpriteH = this.assets[this.imgId].height * currentRatio;
    this.context.translate(this.tileWidth / 2 - sizeSpriteW / 2, this.tileHeight - sizeSpriteH);
    if (this.facingRight) {
      this.context.translate(sizeSpriteW, 0);
      this.context.scale(-1, 1);
    }
    this.context.drawImage(this.assets[this.imgId], 0, 0, sizeSpriteW, sizeSpriteH);

    // Cadre du sprite
    // this.context.fillStyle = '#00FFFF75';
    // this.context.fillRect(0, 0, sizeSpriteW, sizeSpriteH);
  }

  animeRandom() {
    const isIdle = this.imgId >= this.detail.animations.find(a => a.name === 'idle').start
      && this.imgId <= this.detail.animations.find(a => a.name === 'idle').end;

    const shouldMove = Math.random() > 0.60;

    if (isIdle && shouldMove) {
      const direction = this.getRandomDirection();
      this.setDirMove(direction);
    }
    else {
      this.setDirMove(0);
    }
  }

  getRandomDirection() {
    const directions = [
      { direction: 1, weight: 8 },
      { direction: 2, weight: 8 },
      { direction: 3, weight: 1 },
      { direction: 4, weight: 1 },
    ];

    const totalWeight = directions.reduce((a, b) => a + b.weight, 0);

    const randomValue = Math.random() * totalWeight;

    let currentWeight = 0;
    for (let direction of directions) {
      currentWeight += direction.weight;
      if (randomValue < currentWeight) return direction.direction;
    }

    // This should not happen
    return directions[0].direction;
  }

  move() {
    switch (this.dirMove) {
      case 0: // IDLE
        this.imgId++;
        for (const anime of this.detail.animations) {
          if (this.imgId == anime.end + 1) {
            this.imgId = this.detail.animations.find(a => a.name === 'idle').start;
            this.onAction = false;
          }
        }
        break;
      case 1: // DROITE
        if (this.position.x < this.canvas.width - this.tileWidth) this.position.x += 30;
        // Animation de marche possible au bord de la grille
        {
          const animation = this.facingRight ? 'walkFwd' : 'walkBwd';
          this.imgId = this.detail.animations.find(a => a.name === animation).start;
        }
        break;
      case 2: // GAUCHE
        if (this.position.x > this.tileWidth) this.position.x -= 30;
        // Animation de marche possible au bord de la grille
        {
          const animation = this.facingRight ? 'walkBwd' : 'walkFwd';
          this.imgId = this.detail.animations.find(a => a.name === animation).start;
        }
        break;
      case 3: // HAUT
        if (this.position.y > 0) {
          this.position.y -= this.tileHeight;
          this.imgId = this.detail.animations.find(a => a.name === 'jump').start
        }
        break;
      case 4: // BAS
        if (this.position.y < this.canvas.height - this.tileHeight) this.position.y += this.tileHeight;
        // Animation de s'accroupir possible au sol
        this.imgId = this.detail.animations.find(a => a.name === 'crouch').start
        break;
      default:
        break;
    }
  }

  onResize() {
    this.tileWidth = this.canvas.width / 10;
    this.tileHeight = this.canvas.height / 4;

    this.healthBar.barSize = this.tileWidth;

    this.updatePosition();
  }
}