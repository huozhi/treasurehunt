'use strict';

window.gameInfo = getById('gameInfo');

function getById(id) {
  return document.getElementById(id);
}

function getByTagName(tag) {
  return document.getElementsByTagName(tag);
}

function getByClass(classes) {
  return document.getElemnetsByClassName(classes);
}

function first(arr) {
  if (arr.length > 0) return arr[0];
  return null;
}

function last(arr) {
  if (arr.length > 0) return arr[arr.length - 1];
  return null;
}

function createTag(tag) {
  return document.createElement(tag);
}

function isEmptyGrid(posX, posY) {
  var id = getGridId(posX, posY);
  return getById(id).getAttribute('name') === 'empty';
}


function checkInput(value) {
  if (['o','h','k'].indexOf(value) >= 0)
    return true;
  var val = parseInt(value);
  if (isNaN(val) || val > 9 || val < 1)
    return false;
  return true;
}

function getContent(element) {
  return element.innerHTML.replace(/<[^>]*>/g, "");
}

function setContent(element, text) {
  element.innerHTML = text;
}

function removeContent(element) {
  for (var i = 0; i < element.childNodes.length; i++) {
    if (element.childNodes[i].nodeType === 3) {
      element.removeChild(element.childNodes[i]);
    }
  }
}

function judgeHeroNext(posX, posY) {
  var id = getGridId(posX, posY);
  var grid = getById(id);
  var gridType = grid.getAttribute('name');
  if (gridType === 'robot') {
    postEvent(gameInfo, 'over');
    return -1;
  }
  else if (gridType === 'treasure') {
    postEvent(gameInfo, 'treasure');
    // console.log(parseInt(grid.value));
    return parseInt(grid.value);
  }
  return 0;
}

function judgeRobotNext(posX, posY) {
  var id = getGridId(posX, posY);
  var grid = getById(id);
  var gridType = grid.getAttribute('name');
  // console.log('rb next', posX, posY);
  if (gridType === 'hero') {
    console.log('over');
    postEvent(gameInfo, 'over');
    return -1;
  }
  else if (gridType === 'treasure') {
    return parseInt(grid.value);
  }
  return 0;
}

function validNext(posX, posY) {
  if (posX < 0 || posX > 9 || posY < 0 || posY > 9)
    return false;
  var gridId = getGridId(posX, posY);
  var grid = getById(gridId);
  if (grid.getAttribute('name') === 'block')
    return false;
  var classes = grid.getAttribute('class').split(' ');
  // console.log(classes);
  if (classes.indexOf('block') >= 0) return false;
  return true;
}

function getGridId(posX, posY) {
  return 'grid' + (posX * 10 + posY);
}

function clearGrid(posX, posY) {
  var id = getGridId(posX, posY);
  var grid = getById(id);
  // console.log(posX, posY, id, grid);
  grid.style.backgroundColor = DEFAULT_COLOR;
  grid.setAttribute('name', 'empty');
  grid.removeAttribute('value');
  grid.value = "";
}

function setGrid(posX, posY, color, name) {
  var id = getGridId(posX, posY);
  var grid = getById(id);
  // console.log(posX, posY, id, grid);

  grid.style.backgroundColor = color;
  grid.setAttribute('name', name);
  if (!isNaN(parseInt(name)))
    grid.setAttribute('value', name);
}


function createEvent(eventType) {
  var evt = document.createEvent('HTMLEvents');
  evt.initEvent(eventType, true, true);
  return evt;
}

function postEvent(element, eventType) {
  var evt = createEvent(eventType);
  element.dispatchEvent(evt);
}

function onEvent(element, eventType, callback) {
  element.addEventListener(eventType, callback, false);  
}

function calcDistance(start, target) {
  var xDelta = target.x - start.x;
  if (xDelta > 0) {
    xDelta = 1;
  }
  else if (xDelta < 0) {
    xDelta = -1;
  }

  var yDelta = target.y - start.y;
  if (yDelta > 0) {
    yDelta = 1;
  }
  else if (yDelta < 0) {
    yDelta = -1;
  }
  var dis = new Point();
  dis.set(yDelta, xDelta);  
  return dis;
}