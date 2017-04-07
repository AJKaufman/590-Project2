// Credit to simple-server-collision by Cody Van De Mark
// const sockets = require('./sockets.js');

let playerList = {};
// const hits = [];

// const checkCollisions = (rect1, rect2, width, height) => {
//  if (rect1.x < rect2.x + width &&
//     rect1.x + width > rect2.x &&
//     rect1.y < rect2.y + height &&
//     height + rect1.y > rect2.y) {
//    return true;
//  }
//  return false;
// };
//
// const checkHitCollision = (player, hitObj) => {
//  const hit = hitObj;
//
//  if (player.hash === hit.hash) {
//    return false;
//  }
//
//  return checkCollisions(player, hit, hit.width, hit.height);
// };
//
// const checkHits = () => {
//  const keys = Object.keys(playerList);
//  const players = playerList;
//
//
//  const char1 = players[keys[k]];
//
//  const hit = checkHitCollision(cha1, hits[i]);
//
//  if (hit) {
//    sockets.handleHit(char1.hash);
//    delete playerList[char1.hash];
//  } else {
//    console.log('miss');
//  }
//
//
//  hit.splice(i);
//  i--;
// };

const setPlayerList = (serverPlayerList) => {
  playerList = serverPlayerList;
};

const setPlayer = (player) => {
  playerList[player.hash] = player;
};

// const addHit = (hit) => {
//  hits.push(hit);
// };
//
// setInterval(() => {
//  if (hits.length > 0) {
//    checkHits();
//  }
// }, 20);

module.exports.setPlayerList = setPlayerList;
module.exports.setPlayer = setPlayer;
// module.exports.addHit = addHit;

