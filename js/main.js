window.onload = function() {
  var submit = document.getElementById('boardSizeSubmit'),
      select = document.getElementsByName('board_size');

  submit.onclick = function() {
    var size = select[0].value.substr(0, select[0].value.indexOf('x'));

    initBoard('gameboard', size, size);
  }
  
  var gameboard = initBoard('gameboard', 8, 8);
}

function initBoard(boardId, rows, cols) {

  var gameboard = new Gameboard(boardId, rows, cols);
  gameboard.drawBoard();
  gameboard.drawPlayer(2,2, 'player2');
  return gameboard;
}
