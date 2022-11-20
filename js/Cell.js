export class Cell {
  constructor() {
    this.state = 0;
    this.player;
  }

  setPlayer(player) {
    this.player = player
  }

  getPlayer() {
    return this.player;
  }
  setState(val) {
    this.state = val;
  }

  getState() {
    return this.state;
  }
}
