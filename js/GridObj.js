
// GRILLE OBJ
export class GridObj extends Grid {
  constructor(nbCol, nbLin, plfGrid, ctx, cnv) {
    super(nbCol, nbLin);
    this.plfGrid = plfGrid;
    this.ctx2D = ctx;
    this.cnv = cnv;
    this.assets = [];
    this.nbObj = 19;
    this.img;
    this.imgId = 0;
  }

  loadBg() {
    for (let i = 0; i < this.nbObj; i++) {
      this.img = new Image();
      this.img.src = `assets/img/obj/obj_${i}.png`;
      this.assets.push(this.img);
    }
  }


  generateObj() {
    for (let i = 0; i < this.lig; i++) {
      for (let j = 0; j < this.col; j++) {
        const randJ = Math.floor(Math.random() * 10);
        const randI = Math.floor(Math.random() * 2);
        if (i < 3 && this.plfGrid.grid[randI][randJ].state == 5) {
          const echantillon = Math.random() > 0.85;
          if (echantillon) {
            let randObj = Math.floor(Math.random() * this.nbObj);
            this.grid[randI][randJ].state = randObj;

          }
        }
      }
    }
  }

  drawObj() {
    //this.ctx2D.fillStyle = 'red';
    for (let i = 0; i < this.lig; i++) {
      for (let j = 0; j < this.col; j++) {
        if (this.grid[i][j].state > 0 && this.grid[i][j].state <= 18) {
          //console.log(randObj);
          this.ctx2D.drawImage(this.assets[this.grid[i][j].state], this.cnvW * j, this.cnvH * i + (this.cnvH - this.cnvH / 2), this.cnvW, this.cnvH / 2);
          //this.ctx2D.fillRect(this.cnvW * j, this.cnvH * i + (this.cnvH - this.cnvH /4), this.cnvW, this.cnvH / 8);
        }
      }

    }
  }
}
