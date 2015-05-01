'use strict';

window.ie = (document.all) ? true : false;

var DEFAULT_COLOR = '#FFF',
    HERO_COLOR = '#337ab7',
    ROBOT_COLOR = '#D43F3A', //red
    BLOCK_COLOR = '#f0ad4e',
    TREASURE_COLOR = '#4CAE4C'; // green

var BLOCK_NUM = 3,
    ROBOTS_NUM = 2,
    TREASURES_NUM = 2;


function Game() {
  this.blocks = [];
  this.robots = [];
  this.treasures = [];
  this.hero = new Point();
  // this.hero.set(0, 0, HERO_COLOR);
  this.round = 0;
  // this.treasureCount = 0;
}


Game.prototype.init = function () {
  var self = this;
  onEvent(gameInfo, 'over', function () {
    console.log('game over');
  });
  onEvent(gameInfo, 'treasure', function () {
    console.log('eat treasure');
    var scorePanel = getById('score');
    
    // scorePanel.innerHTML = self.hero.score || scorePanel.innerHTML;
  });
  onEvent(gameInfo, 'win', function () {
    console.log('win');
  });

  this.initMap();
}



Game.prototype.update = function () {

}


Game.prototype.initBlock = function (posX, posY) {
  this.generateRole('block', posX, posY);
}

Game.prototype.initHero = function (posX, posY) {
  this.hero.set(posX, posY, HERO_COLOR);
  setGrid(posX, posY, 'hero', HERO_COLOR);
}


Game.prototype.initRobot = function (posX, posY) {
  this.generateRole('robot', posX, posY);
}

Game.prototype.initTreasure = function (posX, posY, value) {
  this.generateRole('treasure', posX, posY, value);
}

Game.prototype.generateRole = function(roleName, posX, posY, value) {
  var currGrid = getById(getGridId(posX, posY)); // getById('grid' + (posY * 10 + posX));
  var roleColor, roleSet;
  if (roleName === 'treasure') {
    console.log('add treasure')
    roleSet = this.treasures;
    roleColor = TREASURE_COLOR;
    currGrid.value = value ? value : 0;
  }
  else if (roleName === 'block') {
    console.log('add block')
    roleSet = this.blocks;
    roleColor = BLOCK_COLOR;
  }
  else if (roleName === 'robot') {
    console.log('add robot')
    roleSet = this.robots;
    roleColor = ROBOT_COLOR;
  }
  currGrid.setAttribute('name', roleName);
  currGrid.style.backgroundColor = roleColor;
  var point = new Point();
  point.set(posX, posY, roleColor);
  roleSet.push(point);
}


Game.prototype.initMap = function () {
  var self = this;
  var map = getById('map');
  var mapWidth = 10,
    mapHeight = 10;
  for (var i = 0; i < mapHeight; i++) {
    var row = createTag('div')
    row.setAttribute('class', 'row');
    for (var j = 0; j < mapWidth; j++) {
      (function(i, j) {
        var grid = createTag('div');
        grid.setAttribute('class', 'grid btn btn-default');
        grid.setAttribute('name', 'empty');
        grid.setAttribute('id', 'grid' + (i * 10 + j));
        var valueInput = createTag('input');
        valueInput.setAttribute('class', 'form-control');
        valueInput.setAttribute('maxlength', '1');
        valueInput.style.display = 'none';
        grid.appendChild(valueInput)
        valueInput.addEventListener('keydown', function(e) {
          var key;
          if (window.event)
            key = e.keyCode;
          else
            key = e.which;
          var keyValue = String.fromCharCode(key);
        })
        grid.addEventListener('click', function() {
          var status = valueInput.style.display;
          if (status === 'none') {
            valueInput.style.display = 'block';
            valueInput.focus();
          }
          else {
            valueInput.style.display = 'none';
          }
          var value = valueInput.value;
          if (checkInput(value)) {
            // treasure
            // console.log(value)
            if (/^[1-9]$/.test(value)) {
              self.initTreasure(i, j, value);
              grid.innerText = value;
            }
            else if (value === 'o') {
              self.initBlock(i, j);
            }
            else if (value === 'h') {
              self.initHero(i, j);
            }
            else if (value === 'k') {
              self.initRobot(i, j);
            }
          }
          valueInput.value = "";
        });
        
        row.appendChild(grid);
      } (i, j));
    }
    map.appendChild(row);
  }
}

Game.prototype.moveRobots = function () {
  var hero = this.hero;
  for (var i = 0; i < this.robots.length; i++) {
    (function (i, robot) {
      var distance = calcDistance(robot, hero);
      console.log(i, distance.x, distance.y);
      if (distance.x > 0) {
        robot.right();
      }
      else if (distance.x < 0) {
        robot.left();
      }
      if (distance.y > 0) {
        robot.down();
      }
      else if (distance.y < 0) {
        robot.up();
      }

    }(i, this.robots[i]));
  }
}

Game.prototype.moveHero = function (keyValue) {  
  switch (keyValue) {
    case 'A':
      this.hero.left(); break;
    case 'W':
      this.hero.up(); break;
    case 'S':
      this.hero.down(); break;
    case 'D':
      this.hero.right(); break;
    default: break;
  }
  this.round++;
  getById('round').innerHTML = this.round;
}
