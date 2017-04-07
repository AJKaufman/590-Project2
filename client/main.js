// Credit to 590-Project1 by Aidan Kaufman and simple-server-collision by Cody Van De Mark
let canvas;
let ctx;
let walkImage;
let slashImage;
//our websocket connection
let socket; 
let hash;
let animationFrame;
let squares = {};
let attacks = [];
let myScore;
let myRoom;
let player;



// The reload function. 
// Seperated due to the automatic initiation due to ES6 syntax
const reload = () => {
  window.location.reload();
};


const keyDownHandler = (e) => {
  var keyPressed = e.which;
  const square = squares[hash];

  // W OR UP
  if(keyPressed === 87 || keyPressed === 38) {
    square.moveUp = true;
  }
  // S OR DOWN
  else if(keyPressed === 83 || keyPressed === 40) {
    square.moveDown = true;
  }
  
};

const keyUpHandler = (e) => {
  var keyPressed = e.which;
  const square = squares[hash];

  // W OR UP
  if(keyPressed === 87 || keyPressed === 38) {
    square.moveUp = false;
  }
  // S OR DOWN
  else if(keyPressed === 83 || keyPressed === 40) {
    square.moveDown = false;
  }
};

const init = () => {
 
  canvas = document.querySelector('#canvas');
  ctx = canvas.getContext('2d');

  socket = io.connect();
  
  socket.on('joined', setUser);
  socket.on('updatedMovement', update);
  socket.on('left', removeUser);
//  // gives the player a point if they earned it in the last round
//  // checks if the player won the game
//  socket.on('givePoint', updateScore);
//  
//  // ends the game
//  socket.on('endGame', endGame);
  
  document.body.addEventListener('keydown', keyDownHandler);
  document.body.addEventListener('keyup', keyUpHandler);
};

window.onload = init;