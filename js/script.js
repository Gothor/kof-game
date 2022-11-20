import { Game } from './Game.js';

const cnv = document.getElementById('myCanvas');

const game = new Game(cnv);
game.init();
game.start();

window.addEventListener('resize', () => game.onResize());