'use strict';


var DEFAULT_COLOR = '#e6e6e6',
    HERO_COLOR = '#337ab7';
    // BLOCK_COLOR = '#D43F3A',
    // ROBOT_COLOR = 'grey',
    // TREASURE_COLOR = '#4CAE4C';

function Point() {
  this.x = 0;
  this.y = 0;
  this.score = 0;
}

Point.prototype.set = function (posX, posY) {
  this.x = posX;
  this.y = posY;
}

Point.prototype.left = function () {
  if (validNext(this.x, this.y - 1)) {
    clearGrid(this.x, this.y);
    this.y--;
    judgeNext(this.x, this.y);
    setGrid(this.x, this.y, 'hero', HERO_COLOR);
  }
}

Point.prototype.right = function () {
  if (validNext(this.x, this.y + 1)) {
    clearGrid(this.x, this.y);
    this.y++;
    judgeNext(this.x, this.y);
    setGrid(this.x, this.y, 'hero', HERO_COLOR);
  }
}

Point.prototype.up = function () {
  if (validNext(this.x - 1, this.y)) {
    clearGrid(this.x, this.y);
    this.x--;
    judgeNext(this.x, this.y);
    setGrid(this.x, this.y, 'hero', HERO_COLOR);
  }
}

Point.prototype.down = function () {
  if (validNext(this.x + 1, this.y)) {
    clearGrid(this.x, this.y);
    this.x++;
    judgeNext(this.x, this.y);
    setGrid(this.x, this.y, 'hero', HERO_COLOR);
  }
}

