'use strict';

window.ie = (document.all) ? true : false;

window.game = null;

function startGame() {
  document.addEventListener('keydown', keyPressListener)
  
}

function resetGame() {
  document.removeEventListener('keydown', keyPressListener);
  // game.clearMap();
  game = new Game();
  game.init();
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
  game.checkStatus();
}

resetGame();
