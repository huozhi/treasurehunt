'use strict';

var DEFAULT_COLOR = '#e6e6e6',
    HERO_COLOR = '#337ab7';
    // BLOCK_COLOR = '#D43F3A',
    // ROBOT_COLOR = 'grey',
    // TREASURE_COLOR = '#4CAE4C';

var LEFT = 0,
    RIGHT = 1,
    UP = 2,
    DOWN = 3;

function Point() {
  this.x = 0;
  this.y = 0;
  this.score = 0;
  this.color = '#FFF';
  this.name = "";
}

Point.prototype.set = function (posX, posY, color, name) {
  this.x = posX;
  this.y = posY;
  this.color = color;
  this.name = name;
}

Point.prototype.auxMove = function (direct) {
  var posX = this.x, posY = this.y;
  switch (direct) {
    case UP: posX--; break;
    case DOWN: posX++; break;
    case LEFT: posY--; break;
    case RIGHT: posY++; break;
  }
  if (validNext(posX, posY)) {
    clearGrid(this.x, this.y);
    // update position
    this.x = posX;
    this.y = posY;
    // console.log(this.x, this.y, this.color)
    var ret = judgeHeroNext(this.x, this.y);
    if (ret > 0) {
      // console.log(this.score, this.score + ret);
      this.score += ret;
      getById(getGridId(this.x, this.y)).innerText = ""; // eat treasure
      getById('score').innerHTML = this.score;
    }
    else if (ret === -1) {
      getById('message').innerHTML = "Game Over";

    }
    setGrid(this.x, this.y, this.color, this.name);
  }
}

Point.prototype.left = function () {
  this.auxMove(LEFT);
}

Point.prototype.right = function () {
  this.auxMove(RIGHT);
}

Point.prototype.up = function () {
  this.auxMove(UP);
}

Point.prototype.down = function () {
  this.auxMove(DOWN);
}

