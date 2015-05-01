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

function getText(id){
  var element = getById(id);
  return element.innerHTML.replace(/<[^>]*>/g, "");
}


function judgeNext(posX, posY) {
  var id = getGridId(posX, posY);
  var grid = getById(id);
  var gridType = grid.getAttribute('name');
  if (gridType === 'robot') {
    postEvent(gameInfo, 'over');
  }
  else if (gridType === 'treasure') {
    postEvent(gameInfo, 'treasure');
  }

}

function validNext(posX, posY) {
  if (posX < 0 || posX > 9 || posY < 0 || posY > 9)
    return false;
  var gridId = getGridId(posX, posY);
  var grid = getById(gridId);
  if (grid.getAttribute('name') === 'block')
    return false;
  var classes = grid.getAttribute('class').split(' ');
  console.log(classes);
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
  grid.children[0].value = "";
}

function setGrid(posX, posY, name, color) {
  var id = getGridId(posX, posY);
  var grid = getById(id);
  // console.log(posX, posY, id, grid);

  grid.style.backgroundColor = color;
  grid.setAttribute('name', name);
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

