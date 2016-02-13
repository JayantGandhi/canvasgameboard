function drawBoard() {
  var gameboard = document.getElementById('gameboard');

  if (gameboard.getContext) {
    var ctx = gameboard.getContext('2d');

    ctx.strokeRect(0, 0, 300, 300);
  }
}
