// CLASSE PRINCIPALE
export class Grid {
  constructor(nbCol, nbLin) {
    this.col = nbCol;
    this.lig = nbLin;
    this.grid = [];
    this.cnvW = 128 / 2;
    this.cnvH = 120;
  }

  initGrid() {
    for (let i = 0; i < this.lig; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.col; j++) {
        this.grid[i][j] = new Cell();
      }
    }
  }

  coord_to_cell(posX, posY) {
    //console.log(posX, posY);
    let numLine = posY / this.cnvH;
    let numCol = posX / this.cnvW;
    return this.grid[numLine][numCol];
  }
}
