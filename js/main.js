"use strict";

var player_count = 2, rows = 8, cols = 8;

window.onload = function() {
  var boardSubmit  = document.getElementById('boardSizeSubmit'),
      boardSelect  = document.getElementsByName('board_size'),
      playerSubmit = document.getElementById('playerCountSubmit'),
      playerSelect = document.getElementsByName('player_count'),
      boardSize    = Math.floor((window.innerHeight * .8)/10) * 10;

  boardSubmit.onclick = function() {
    rows  = parseInt(boardSelect[0].value.substr(0, boardSelect[0].value.indexOf('x')));
    cols  = parseInt(boardSelect[0].value.substr(boardSelect[0].value.indexOf('x') + 1, boardSelect[0].value.length));

    var board = initBoard('gameboard', rows, cols, player_count);
    initInfo('gameinfo', 'playerActions');
  }

  playerSubmit.onclick = function() {
    player_count = playerSelect[0].value;

    var board = initBoard('gameboard', rows, cols, player_count);
    initInfo('gameinfo', 'playerActions');
  }

  document.getElementById('showMap').onclick = function() {
    $('#background').css({
      'width'  : boardSize + 'px',
      'height' : boardSize + 'px'
    });
  }

  var gameboard = initBoard('gameboard', 8, 8);
  initInfo('gameinfo', 'playerActions');
}

function initBoard(boardId, rows, cols, playerCount) {
  var gameboard,
      canvasSize = Math.floor((window.innerHeight * .8)/10) * 10;

  //set the size of the canvas based on the window
  $("#" + boardId).attr({
    'width'  : canvasSize,
    'height' : canvasSize
  });
  $("#" + boardId + "Mask").attr({
    'width'  : canvasSize,
    'height' : canvasSize
  });

  gameboard = new Gameboard(boardId, rows, cols);
  initPlayers(player_count, gameboard)

  gameboard.drawBoard();


  //set listeners on gameboard
  gameboard.unsetListeners();
  gameboard.setListeners();
  return gameboard;
}

function initPlayers(count, gameboard) {
  var players = [];

  for (var i = 0; i < count; i++) {
    players[i] = new Player(null, null, gameboard, 'player' + i);
  }

  gameboard.setPlayers(players);

  for (var i = 0; i < count; i++) {
    //distribute around board

    switch (i%4) {
      case 3:
        gameboard.drawPlayer(0, gameboard.cols - 1, 'player'+i);
        break;
      case 2:
        gameboard.drawPlayer(gameboard.rows - 1, 0, 'player'+i);
        break;
      case 1:
        gameboard.drawPlayer(gameboard.rows - 1, gameboard.cols - 1, 'player'+i);
        break;
      case 0:
        gameboard.drawPlayer(0, 0, 'player'+i);
        break;
    }
  }
}

function initInfo(gameInfoId, playerActionId) {
  var gameinfo,
      playeractions,
      canvasSize = Math.floor(window.innerHeight * .3);

  $("#" + gameInfoId).attr({
    'width'  : canvasSize,
    'height' : canvasSize
  });

  $("#" + playerActionId).attr({
    'width'  : canvasSize,
    'height' : canvasSize
  });

  gameinfo = new GameInfo(gameInfoId);
  playeractions = new PlayerActions(playerActionId);
  playeractions.unsetListeners();
  playeractions.setListeners();
}
