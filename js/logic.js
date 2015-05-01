'use strict';

window.ie = (document.all) ? true : false;

var game = new Game();
game.init();

function startGame() {
  document.addEventListener('keydown', keyPressListener)
}

function resetGame() {
  document.removeEventListener('keydown', keyPressListener);
}

function keyPressListener(e) {
  var key;
  if (window.event) {
    key = event.keyCode;
  }
  else {
    key = e.which;
  }
  var keyValue = String.fromCharCode(key);
  game.moveHero(keyValue);
  game.moveRobots();
}

