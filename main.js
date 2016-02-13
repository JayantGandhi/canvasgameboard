function drawBoard(rows, cols) {
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
