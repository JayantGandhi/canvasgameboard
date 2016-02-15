/**
 * Draws the game board
 * defaults to a 5x5 grid if not specified
 */
function drawBoard(rows, cols) {
  var rows = typeof rows !== 'undefined' ? rows : 5,
      cols = typeof cols !== 'undefined' ? cols : 5;


  var gameboard = document.getElementById('gameboard');

  if (gameboard.getContext) {
    var ctx        = gameboard.getContext('2d'),
        cellHeight = gameboard.height / rows,
        cellWidth  = gameboard.width / cols;
    // set background of board
    // ctx.fillStyle = "#333";
    // ctx.fillRect(0, 0, 300, 300);

    ctx.beginPath();
    // draw board grid
    for (var i = 0; i <= 300; i+= cellHeight) { //horizontal lines
      ctx.moveTo(0, i);
      ctx.lineTo(300, i);
    }

    for (var i = 0; i <= 300; i+= cellWidth) { //vertical lines
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 300);
    }

    ctx.stroke();
  }
}

/**
 * draws player at specified coordinates
 */
function drawPlayer(x, y, radius, ctx) {
  ctx.moveTo(x, y);
  ctx.arc(x, y, radius, 0, Math.PI * 2);
}

/**
 * places the player at the specified row/col
 */
function placePlayer(row, col) {

}
