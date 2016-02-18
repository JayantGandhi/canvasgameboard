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
 * @param {bool}   uncovered defaults to false
 */
function Cell(row, col, uncovered) {
  this.cellWidth = gameboard.cellWidth;
  this.cellHeight = gameboard.cellHeight;

  this.setRow(row);
  this.setCol(col);

  if (typeof uncovered !== 'undefined') {
    this.uncovered = uncovered;
  } else {
    this.uncovered = false;
  }
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
Cell.prototype.draw = function(opacity) {
  var opacity = opacity || 0.3;

  if (!this.uncovered) {
    gameboard.ctx.fillStyle = 'rgba(0,0,0,' + opacity +')';
    gameboard.ctx.strokeRect(this.x, this.y, gameboard.cellWidth, gameboard.cellHeight);
    gameboard.ctx.fillRect(this.x, this.y, gameboard.cellWidth, gameboard.cellHeight);
  } else {
    gameboard.ctx.strokeRect(this.x, this.y, gameboard.cellWidth, gameboard.cellHeight);
  }
}

/**
 * Empties cell of contents
 * @return {[type]} [description]
 */
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
  this.clear();
  this.draw();
};

/**
 * Marks the cell as uncovered
 * @param  callback  optional callback
 * @return {[type]} [description]
 */
Cell.prototype.uncover = function (callback) {
  var cell = this,
      opacity = 0.3;

  window.requestAnimationFrame(function fadeIn(){
    if (opacity > 0) {
      cell.clear();
      cell.draw(opacity)
      opacity -= 0.01;
      window.requestAnimationFrame(fadeIn);
    } else {
      cell.uncovered = true;
      typeof callback === 'function' && callback();
    }
  });
};

function GameEvent(title, description, points, penalty) {

  this.description = description || '';
  this.title = title || '';
  this.points = points || '';
  this.penalty = penalty || '';
}

GameEvent.prototype = Object.create(Cell.prototype);

GameEvent.prototype.unCover = function () {
  Cell.call(this);
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
      this.board[i][j] = (new Cell(i, j, false));
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
Player.prototype.draw = function (x, y, canvas) {
  var x_coord, y_coord, canvas;

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

  if (typeof canvas !== 'undefined') {
    canvas = canvas;
  } else {
    canvas = gameboard;
  }

  var radius = (this.cellWidth / 2) - 1;
  // save original context - becuase we will be defining a clip
  canvas.ctx.save();

  canvas.ctx.beginPath();
  //clear the cell
  canvas.ctx.clearRect(x_coord, y_coord, this.cellWidth, this.cellHeight);
  if (gameboard.current_player == this.name) {
    canvas.ctx.fillStyle = 'blue';
    canvas.ctx.fillRect(x_coord, y_coord, this.cellWidth, this.cellHeight);
  }
  canvas.ctx.moveTo(x_coord + (this.cellWidth/2), y_coord + (this.cellHeight/2));
  canvas.ctx.arc(x_coord + (this.cellWidth/2), y_coord + (this.cellHeight/2), radius, 0, Math.PI * 2);
  canvas.ctx.clip();
  canvas.ctx.drawImage(this.avatar, x_coord, y_coord, this.cellWidth, this.cellHeight);

  canvas.ctx.closePath();
  canvas.ctx.stroke();

  // restore original context
  canvas.ctx.restore();};

/**
 * Moves the player to specified (row, col)
 * @param  {[type]} row [description]
 * @param  {[type]} col [description]
 * @return {[type]}     [description]
 */
Player.prototype.move = function (row, col) {
  var target_x      = this.cellWidth * col,
      target_y      = this.cellHeight * row,
      anim_target_x = Math.floor(target_x), //this should change with a fixed canvas
      anim_target_y = Math.floor(target_y), //rounding errors mean I have to fudge
      x             = Math.floor(this.x),   //the numbers a little here to make the
      y             = Math.floor(this.y),   //animation actually end
      player        = this,
      x_step        = 1,
      y_step        = 1,
      animlayr      = {
        'canvas' : gameboard.animationLayer,
        'ctx'    : gameboard.animationLayer.getContext('2d')
      };

  if (target_x < 0 || target_y < 0 || target_x >= gameboard.canvas.width || target_y >= gameboard.canvas.height) {
    return true;
  }

  this.clear();
  window.requestAnimationFrame(function render() {
    if (x !== anim_target_x || y !== anim_target_y) {
      if (x < anim_target_x) {
        x += x_step;
      } else if (x > anim_target_x) {
        x -= x_step;
      }

      if (y < anim_target_y) {
        y += y_step;
      } else if (y > anim_target_y) {
        y -= y_step;
      }

      player.clear();
      animlayr.ctx.clearRect(0, 0, animlayr.canvas.width, animlayr.canvas.height);
      player.draw(x,y,animlayr);
      window.requestAnimationFrame(render);
    } else {
      animlayr.ctx.clearRect(0, 0, animlayr.canvas.width, animlayr.canvas.height);
      player.draw(target_x, target_y, gameboard);
      player.x = target_x;
      player.y = target_y;
    }
  });



  //save position in gameboard
  gameboard.board[this.row][this.col] = new Cell(this.row, this.col, true);
  gameboard.board[this.row][this.col].draw();
  gameboard.board[row][col]           = this;
  this.setRow(row);
  this.setCol(col);

  // reset listeners on gameboard
  gameboard.unsetListeners();
  gameboard.setListeners();
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

      var direction = event.target.name;

      player_action.movePlayer(direction);
    }
  });
};

PlayerActions.prototype.unsetListeners = function () {
  $('.action-btn').off('click');
}

PlayerActions.prototype.movePlayer = function (direction) {
  var player_act = this,
      player     = this.player,
      target_row = player.row,
      target_col = player.col;

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

  //uncover that cell
  gameboard.board[target_row][target_col].uncover(function(){
    player.move(target_row, target_col);
    player_act.action_occuring = false;
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
