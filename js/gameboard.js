/**
 * Gameboard.js
 * Creates the Gameboard prototype
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
