"use strict";
/**
* Gameboard.js
* Creates the Gameboard prototype
*/

var gameboard;

function Cell(row, col) {
  this.row = row;
  this.col = col;
  this.gameEvent;
}

/**
 * Defines the Gameboard object
 * @param {[type]} id      [description]
 * @param {[type]} rows    [description]
 * @param {[type]} cols    [description]
 * @param {[type]} players [description]
 */
function Gameboard(id, rows, cols, players, current_player) {
  var id   = typeof id !== 'undefined' ? id : 'gameboard',
      rows = typeof rows !== 'undefined' ? rows : 5,
      cols = typeof cols !== 'undefined' ? cols : 5;

  if (typeof players === 'undefined') {
    var temp    = [new Player('player1'), new Player('player2')],
        players = [];

    for (var i = 0; i < temp.length; i++) {
      players[temp[i].name] = temp[i];
    }
  }

  gameboard = this;

  this.canvas = document.getElementById(id);
  this.board = [];
  this.ctx = this.canvas.getContext('2d');
  this.cellHeight = this.canvas.height / rows;
  this.cellWidth = this.canvas.width /cols;
  this.players = players;
  this.current_player = current_player;

  this.board.push([])
  for (var i = 1; i <= rows; i++) {
    this.board.push([i])

    for (var j = 1; j <= cols; j++) {
      this.board[i].push(new Cell(i, j));
    }
  }
}

/**
 * Draws the gameboard
 * @return {[type]} [description]
 */
Gameboard.prototype.drawBoard = function () {
  this.ctx.beginPath();
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  for (var i = 0; i <= this.canvas.height; i+= this.cellHeight) { //horizontal lines
    this.ctx.moveTo(0, i);
    this.ctx.lineTo(this.canvas.height, i);
  }

  for (var i = 0; i <= this.canvas.width; i+= this.cellWidth) { //vertical lines
    this.ctx.moveTo(i, 0);
    this.ctx.lineTo(i, this.canvas.width);
  }
  this.ctx.closePath();
  this.ctx.stroke();

};

/**
 * Draws the specified player at (row, col)
 * @param  {[type]} row      [description]
 * @param  {[type]} col      [description]
 * @param  {[type]} playerId [description]
 * @return {[type]}          [description]
 */
Gameboard.prototype.drawPlayer = function(row, col, playerId) {
  var radius = (this.cellWidth / 2) - 1,
      x      = (this.cellWidth * col) - (this.cellWidth/2),
      y      = (this.cellHeight * row) - (this.cellHeight/2),
      player = this.players[playerId];

  //save player position
  this.players[playerId].cell = this.board[row][col];

  // save original context - becuase we will be defining a clip
  this.ctx.save();

  this.ctx.beginPath();
  this.ctx.moveTo(x, y);
  this.ctx.arc(x, y, radius, 0, Math.PI * 2);
  this.ctx.clip();
  this.ctx.drawImage(player.avatar, x - (this.cellWidth/2), y - (this.cellHeight/2), this.cellWidth, this.cellHeight);

  this.ctx.closePath();
  this.ctx.stroke();

  // restore original context
  this.ctx.restore();
}

Gameboard.prototype.highlightCell = function () {
  $(this.canvas).on('mousemove', function(event) {
    var offset = $(gameboard.canvas).offset(),
        mousePosition = {x: event.pageX - offset.left, y: (event.pageY - offset.top)};

    console.log(Math.floor(mousePosition.x/gameboard.cellWidth));
  });
};
