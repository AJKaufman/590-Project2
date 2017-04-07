// Credit to simple-server-collision by Cody Van De Mark
const sockets = require('./sockets.js');

let charList = {};
const hits = [];

const checkCollisions = (rect1, rect2, width, height) => {
  if (rect1.x < rect2.x + width &&
     rect1.x + width > rect2.x &&
     rect1.y < rect2.y + height &&
     height + rect1.y > rect2.y) {
    return true;
  }
  return false;
};

const checkPaddleCollision = (character, hitObj) => {
  const hit = hitObj;

  if(character.hash === hit.hash) {
    return false;
  }
  
  return checkCollisions(character, attack, attack.width, attack.height);
};

const checkHits = () => {
  const keys = Object.keys(charList);
  const characters = charList;
  
  
      const char1 = characters[keys[k]];
      
      const hit = checkAttackCollision(cha1, attacks[i]);
      
      if(hit) {
        sockets.handleAttack(char1.hash);
        delete charList[char1.hash];
      } else {
        console.log('miss');
      }
    
    
    attack.splice(i);
    i--;
    
  
  
};

const setPlayerList = (characterList) => {
  charList = characterList;
};

const setPlayer = (character) => {
  charList[character.hash] = character;
};

const addHit = (hit) => {
  hits.push(hit);
};

setInterval(() => {
  if(hits.length > 0) {
      checkHits();
  }
}, 20);

module.exports.setPlayerList = setPlayerList;
module.exports.setPlayer = setPlayer;
module.exports.addHit = addHit;

















