"use strict";

window.onload = function() {
  var submit = document.getElementById('boardSizeSubmit'),
      select = document.getElementsByName('board_size');

  submit.onclick = function() {
    var rows = parseInt(select[0].value.substr(0, select[0].value.indexOf('x'))),
        cols = parseInt(select[0].value.substr(select[0].value.indexOf('x') + 1, select[0].value.length));

    initBoard('gameboard', rows, cols);
  }

  var gameboard = initBoard('gameboard', 8, 8);
  initInfo('gameinfo', 'playerinfo');
}

function initBoard(boardId, rows, cols) {
  var gameboard,
      canvasSize = Math.floor(window.innerHeight * .8);

  //set the size of the canvas based on the window
  $("#" + boardId).attr({
    'width'  : canvasSize,
    'height' : canvasSize
  });
  $("#" + boardId + "Mask").attr({
    'width'  : canvasSize,
    'height' : canvasSize,
    'style'  : 'margin-left:' + (0 - canvasSize) + 'px'
  });

  gameboard = new Gameboard(boardId, rows, cols);
  gameboard.current_player = 'player2';
  gameboard.drawBoard();

  // temp code for demo
  gameboard.drawPlayer(rows - 2, cols - 2, 'player1')
  gameboard.drawPlayer(1,1, 'player2');

  //set listeners on gameboard
  gameboard.unsetListeners();
  gameboard.setListeners();
  return gameboard;
}

function initInfo(gameinfoId, playerinfoId) {
  var gameinfo,
      playerinfo,
      canvasSize = Math.floor(window.innerHeight * .3);

  $("#" + gameinfoId).attr({
    'width'  : canvasSize,
    'height' : canvasSize
  });

  $("#" + playerinfoId).attr({
    'width'  : canvasSize,
    'height' : canvasSize
  });

  gameinfo = new GameInfo(gameinfoId);
  playerinfo = new PlayerInfo(playerinfoId, 'player1')
}
