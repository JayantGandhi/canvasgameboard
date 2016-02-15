/**
* Gameboard.js
* Creates the Gameboard prototype
*/

/**
 * Defines the Gameboard object
 * @param {[type]} id      [description]
 * @param {[type]} rows    [description]
 * @param {[type]} cols    [description]
 * @param {[type]} players [description]
 */
function Gameboard(id, rows, cols, players) {
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

  this.board = document.getElementById(id);
  this.ctx = this.board.getContext('2d');
  this.cellHeight = this.board.height / rows;
  this.cellWidth = this.board.width /cols;
  this.players = players;
}

/**
 * Draws the gameboard
 * @return {[type]} [description]
 */
Gameboard.prototype.drawBoard = function () {
  this.ctx.beginPath();

  for (var i = 0; i <= 300; i+= this.cellHeight) { //horizontal lines
    this.ctx.moveTo(0, i);
    this.ctx.lineTo(300, i);
  }

  for (var i = 0; i <= 300; i+= this.cellWidth) { //vertical lines
    this.ctx.moveTo(i, 0);
    this.ctx.lineTo(i, 300);
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

  this.ctx.beginPath();
  this.ctx.moveTo(x, y);
  this.ctx.arc(x, y, radius, 0, Math.PI * 2);
  this.ctx.clip();
  this.ctx.drawImage(player.avatar, x - (this.cellWidth/2), y - (this.cellHeight/2), this.cellWidth, this.cellHeight);

  this.ctx.closePath();
  this.ctx.stroke();
 }
