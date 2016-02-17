"use strict";
/**
* Gameboard.js
* Creates the Gameboard prototype
*/

var gameboard, currentCell, hoveredCell;

/**
 * Object for each game cell
 * @param {[type]} row       row of cell (0 indexed)
 * @param {[type]} col       column of cell (0 indexed)
 * @param {[type]} x         x coord of top left corner
 * @param {[type]} y         y coord of top left corner
 */
function Cell(row, col) {
  this.cellWidth = gameboard.cellWidth;
  this.cellHeight = gameboard.cellHeight;

  this.setRow(row);
  this.setCol(col);

  this.uncovered = false;
}

/**
 * sets the row attribute and calculates y
 * @param  {[type]} row [description]
 * @return {[type]}     [description]
 */
Cell.prototype.setRow = function(row) {
  this.row = row;
  this.y   = this.cellHeight * row;
}

/**
 * sets the col attribute and calculates x
 * @param  {[type]} col [description]
 * @return {[type]}     [description]
 */
Cell.prototype.setCol = function(col) {
  this.col = col;
  this.x   = this.cellWidth * col;
}

/**
 * Draws the cell
 * @return {[type]} [description]
 */
Cell.prototype.draw = function() {
  if (!this.uncovered) {
    // var font = (Math.floor(this.cellHeight * .75)).toString() + "px serif";
    // gameboard.ctx.save();
    // gameboard.ctx.font = font;
    // gameboard.ctx.textBaseline = 'middle';
    // gameboard.ctx.textAlign = 'center';
    // gameboard.ctx.fillText('?', this.x + (this.cellWidth/2), this.y + (this.CellHeight/2));
    // gameboard.ctx.restore();
    gameboard.ctx.fillStyle = 'rgba(0,0,0,0.3)';
    gameboard.ctx.fillRect(this.x, this.y, gameboard.cellWidth, gameboard.cellHeight);
  }
}

Cell.prototype.clear = function () {
  gameboard.ctx.clearRect(this.x, this.y, gameboard.cellWidth, gameboard.cellHeight);
};

/**
 * Highlights the given cell
 * @return {[type]} [description]
 */
Cell.prototype.highlight = function () {
  gameboard.ctx.fillStyle = 'rgba(0,0,0,0.5)';
  gameboard.ctx.fillRect(this.x, this.y, gameboard.cellWidth, gameboard.cellHeight);
};

/**
 * unhighlights the given cell
 * @return {[type]} [description]
 */
Cell.prototype.unHighlight = function () {
  // gameboard.ctx.clearRect(this.x, this.y, gameboard.cellWidth, gameboard.cellHeight);
  this.clear();
  gameboard.ctx.strokeRect(this.x, this.y, gameboard.cellWidth, gameboard.cellHeight);
  this.draw();
};


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

  gameboard = this;

  this.canvas = document.getElementById(id);
  this.board = [];
  this.ctx = this.canvas.getContext('2d');
  this.cellHeight = this.canvas.height / rows;
  this.cellWidth = this.canvas.width /cols;
  this.animationLayer = document.getElementById(id + "Mask");

  if (typeof players === 'undefined') {
    var temp    = [new Player(null, null, this, 'player1'), new Player(null, null, this, 'player2')],
        players = [];

    for (var i = 0; i < temp.length; i++) {
      players[temp[i].name] = temp[i];
    }
  }

  this.players = players;
  this.current_player = current_player;

  for (var i = 0; i < rows; i++) {
    this.board.push([i])

    for (var j = 0; j < cols; j++) {
      this.board[i][j] = (new Cell(i, j, this));
    }
  }
}

/**
 * Defines a player object
 * @param {[type]} name        [description]
 * @param {[type]} avatar_path [description]
 */
function Player(x, y, gameboard, name, avatar_path) {
  var avatar;

  Cell.call(this, x, y, gameboard);

  if (typeof avatar_path !== 'undefined') {
    avatar = document.createElement('img');
    avatar.src = avatar_path
  } else {
    // default avatar
    avatar = document.getElementById('userAvatar');
  }
  this.name = name;
  this.avatar = avatar;
  this.uncovered = true;
};

// Player inherits from cell
Player.prototype = Object.create(Cell.prototype);

Player.prototype.highlight = function () {
  return false;
};

Player.prototype.unHighlight = function () {
  return false;
};

/**
 * Draw the player at the given coordinates
 * @param  {[type]} x x coord of top left corner (defaults to stored value)
 * @param  {[type]} y y coord of top left corner (defaults to stored value)
 * @return {[type]}   [description]
 */
Player.prototype.draw = function (x, y) {
  var x_coord, y_coord;

  if (typeof x !== 'undefined') {
    x_coord = x;
  } else {
    x_coord = this.x;
  }

  if (typeof y !== 'undefined') {
    y_coord = y;
  } else {
    y_coord = this.y;
  }

  var radius = (this.cellWidth / 2) - 1;
  // save original context - becuase we will be defining a clip
  gameboard.ctx.save();

  gameboard.ctx.beginPath();
  //clear the cell
  gameboard.ctx.clearRect(x_coord, y_coord, this.cellWidth, this.cellHeight);
  if (gameboard.current_player == this.name) {
    gameboard.ctx.fillStyle = 'blue';
    gameboard.ctx.fillRect(x_coord, y_coord, this.cellWidth, this.cellHeight);
  }
  gameboard.ctx.moveTo(x_coord + (this.cellWidth/2), y_coord + (this.cellHeight/2));
  gameboard.ctx.arc(x_coord + (this.cellWidth/2), y_coord + (this.cellHeight/2), radius, 0, Math.PI * 2);
  gameboard.ctx.clip();
  gameboard.ctx.drawImage(this.avatar, x_coord, y_coord, this.cellWidth, this.cellHeight);

  gameboard.ctx.closePath();
  gameboard.ctx.stroke();

  // restore original context
  gameboard.ctx.restore();};

/**
 * Moves the player to specified (row, col)
 * @param  {[type]} row [description]
 * @param  {[type]} col [description]
 * @return {[type]}     [description]
 */
Player.prototype.move = function (row, col) {
  // setTimeout(function() {

    var target_x = this.cellWidth * row,
        target_y = this.cellHeight * col,
        animlayr = {
          'canvas' : gameboard.animationLayer,
          'ctx'    : gameboard.animationLayer.getContext('2d')
        };

    console.log(animlayr);

    return true;
  // }, 2000);
};

// repoint constructor
Player.prototype.constructor = Player;

/**
 * Information about Cells
 * @param {[type]} gameinfoId [description]
 */
function GameInfo(gameinfoId) {
}

/**
 * Stores the player's relevant information
 * @param {[type]} playerActionId [description]
 * @param {[type]} player_name  [description]
 */
function PlayerActions(playerActionId) {
  this.canvas = document.getElementById(playerActionId);
  this.player = gameboard.players[gameboard.current_player];
  this.action_occuring = false;
}

PlayerActions.prototype.setListeners = function () {
  var player_action = this;

  $('.action-btn').on('click', function(event) {
    if (!player_action.action_occuring) {
      player_action.action_occuring = true;

      var direction = event.target.name,
          promise   = new Promise(function(resolve, reject) {

            if (player_action.movePlayer(direction)) {
              console.log('sup');
              resolve();
            }
      });

      promise.then(function(){
        player_action.action_occuring = false;
      });
    }
  });
};

PlayerActions.prototype.movePlayer = function (direction) {
  var player     = this.player,
      target_row = player.row,
      target_col = player.col,
      promise    = new Promise(function(resolve, reject) {
        if (player.move(target_row, target_col)) {
          resolve();
        }
      });;

  switch (direction) {
    case 'left':
      target_col--;
      break;

    case 'up':
      target_row--;
      break;

    case 'right':
      target_col++;
      break;

    case 'down':
      target_row++;
      break;
  }

  promise.then(function(){
    return true;
  });
};

/**
 * Draws the gameboard
 * @return {[type]} [description]
 */
Gameboard.prototype.drawBoard = function () {
  this.ctx.beginPath();
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  //draw the grid lines
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

  for (var i = 0; i < this.board.length; i++) {
    for (var j = 0; j < this.board[i].length; j++) {
      this.board[i][j].draw();
    }
  }

};

/**
 * Draws the specified player at (row, col)
 * @param  {[type]} row      [description]
 * @param  {[type]} col      [description]
 * @param  {[type]} playerId [description]
 * @return {[type]}          [description]
 */
Gameboard.prototype.drawPlayer = function(row, col, playerId) {
  var x      = (this.cellWidth * (col)),
      y      = (this.cellHeight * (row)),
      player = this.players[playerId];

  //save player position
  player.setRow(row);
  player.setCol(row);
  this.board[row][col] = player;

  player.draw();
}

Gameboard.prototype.setListeners = function () {
  $(this.canvas).on('mousemove', function(event) {
    var $canvas = $(event.target),
        offset = $canvas.offset(),
        mousePosition = {x: event.pageX - offset.left, y: (event.pageY - offset.top)},
        row = Math.floor(mousePosition.y/gameboard.cellWidth),
        col = Math.floor(mousePosition.x/gameboard.cellHeight),
        cell = gameboard.board[row][col];

    if (cell.constructor.name === 'Player') {
      $canvas.attr('style','cursor:pointer;');
    } else {
      $canvas.attr('style','cursor:help;');
    }

    if (hoveredCell !== cell) {
      if (typeof hoveredCell !== 'undefined'){
        try {
          hoveredCell.unHighlight();
        } catch(e) {};
      }

      hoveredCell = cell;
      try {
        hoveredCell.highlight();
      } catch(e) {};

      $canvas.trigger('hovered_cell_changed');
    }

  });
};

Gameboard.prototype.unsetListeners = function () {
  $(this.canvas).off('mousemove');
};
