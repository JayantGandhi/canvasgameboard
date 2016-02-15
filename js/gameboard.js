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
     cols = typeof cols !== 'undefined' ? cols : 5,
     players = typeof players !== 'undefined' ? players : ['player1', 'player2', 'player3', 'player4'];
 this.board = document.getElementById(id);
 this.ctx = this.board.getContext('2d');
 this.cellHeight = this.board.height / rows;
 this.cellWidth = this.board.width /cols;
 this.players = players;
}

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

 this.ctx.stroke();
};

Gameboard.prototype.drawPlayer = function(row, col, playerId) {
  var radius = (this.cellWidth / 2) - 1,
      x      = (this.cellWidth * col) - (this.cellWidth/2),
      y      = (this.cellHeight * row) - (this.cellHeight/2);

  //temporary until I figure out a better way to handle user's avatars
  var playerImage = document.getElementById('userAvatar');

  this.ctx.beginPath();
  this.ctx.moveTo(x, y);
  this.ctx.arc(x, y, radius, 0, Math.PI * 2);
  this.ctx.stroke();
  this.ctx.clip();
  this.ctx.drawImage(playerImage, x - (this.cellWidth/2), y - (this.cellHeight/2), this.cellWidth, this.cellHeight);

 }
