"use strict";
/**
 * Defines a player object
 * @param {[type]} name        [description]
 * @param {[type]} avatar_path [description]
 */
function Player(name, avatar_path) {
  var avatar;

  if (typeof avatar_path !== 'undefined') {
    avatar = document.createElement('img');
    avatar.src = avatar_path
  } else {
    // default avatar
    avatar = document.getElementById('userAvatar');
  }

  this.name = name;
  this.avatar = avatar;
  this.cell;
  console.log(this);
}

// Player.prototype.play = function () {
//   $
// };
