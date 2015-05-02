'use strict';

window.ie = (document.all) ? true : false;
var messagePanel = getById('message');


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
  this.hero = null;//new Point();
  // this.hero.set(0, 0, HERO_COLOR);
  this.round = 0;
  this.treasureCount = 0;
}


Game.prototype.init = function () {
  this.clearMap();
  this.initMap();
  var self = this;
  onEvent(gameInfo, 'over', function () {
    console.log('game over');
    // alert('game over');
    messagePanel.innerText = "Game Over !!";
    // restart()
  });
  onEvent(gameInfo, 'treasure', function () {
    console.log('eat treasure');
    var scorePanel = getById('score');
    messagePanel.innerText = "Get Treasure !!";
    --self.treasureCount;
    // scorePanel.innerHTML = self.hero.score || scorePanel.innerHTML;
  });
  onEvent(gameInfo, 'win', function () {
    messagePanel.innerText = "Win !";
    console.log('win');
  });

}



Game.prototype.checkStatus = function () {
  if (this.treasureCount === 0) {
    postEvent(gameInfo, 'win');
  }
}


Game.prototype.initBlock = function (posX, posY) {
  this.generateRole('block', posX, posY);
}

Game.prototype.initHero = function (posX, posY) {
  if (this.hero == null) {
    this.hero = new Point();
    this.hero.set(posX, posY, HERO_COLOR, 'hero');
    setGrid(posX, posY, HERO_COLOR, 'hero');
  }
}


Game.prototype.initRobot = function (posX, posY) {
  this.generateRole('robot', posX, posY);
}

Game.prototype.initTreasure = function (posX, posY, value) {
  this.generateRole('treasure', posX, posY, value);
  this.treasureCount++;
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
  point.set(posX, posY, roleColor, roleName);
  roleSet.push(point);
}

Game.prototype.clearMap = function () {
  getById('map').innerHTML = "";
  
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
      }(i, j));

    }
    map.appendChild(row);
  }
}

Game.prototype.moveRobots = function () {
  var hero = this.hero;
  for (var i = 0; i < this.robots.length; i++) {
    (function (i, robot) {
      var distance = calcDistance(robot, hero);
      // console.log(i, distance.x, distance.y);
      var nextX = robot.x + distance.x,
          nextY = robot.y + distance.y;
      // console.log('x', robot.x, distance.x, nextX);
      // console.log('y', robot.y, distance.y, nextY);

      var ret = judgeRobotNext(nextX, robot.y);
      if (ret === 0) {
        console.log(i, nextX, robot.y);
        return;
      }
      if (distance.x > 0 && validNext(nextX, robot.y)) {
        robot.down();
      }
      else if (distance.x < 0 && validNext(nextX, robot.y)) {
        robot.up();
      }
      ret = judgeRobotNext(robot.x, nextY);
      if (ret === 0) {
        console.log(i, robot.x, nextY);       
        return;
      }
      if (distance.y > 0 && validNext(robot.x, nextY)) {
        robot.right();
      }
      else if (distance.y < 0 && validNext(robot.x, nextY)) {
        robot.left();
      }
      console.log(i, robot.x, robot.y);
    }(i, this.robots[i]));
  }
}

Game.prototype.moveHero = function (keyValue) {  
  var ret;
  switch (keyValue) {
    case 'A':
      ret = this.hero.left(); break;
    case 'W':
      ret = this.hero.up(); break;
    case 'S':
      ret = this.hero.down(); break;
    case 'D':
      ret = this.hero.right(); break;
    default:
      ret = -1;
      break;
  }
  if (ret !== -1) this.round++;
  getById('round').innerHTML = this.round;
}
