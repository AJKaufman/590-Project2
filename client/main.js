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
let oScore;
let myRoom;
let side;
let ball;
let ballMove;



// The reload function. 
// Seperated due to the automatic initiation due to ES6 syntax
const reload = () => {
  window.location.reload();
};


const keyDownHandler = (e) => {
  let keyPressed = e.which;
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

const removeWaitMessage = () => {
  // update innerHTML
  let content = document.querySelector('#mainMessage');
  content.innerHTML = "";
  let displayScore = document.querySelector('#score');
  displayScore.innerHTML = '<div style="float: left; padding-left: 20%; padding-top: 2%;">' + myScore;
  displayScore.innerHTML += '</div> <div style="float: right; padding-right: 20%; padding-top: 2%;">' + oScore + "</div>";
  const signIn = document.querySelector('#signIn');
  signIn.innerHTML = "";  
  const jButt = document.querySelector('#joinButton');
  jButt.innerHTML = "";  
  const hrb = document.querySelector('#hostRoomButton');
  hrb.innerHTML = "";
  const jrb = document.querySelector('#joinRoomButton');
  jrb.innerHTML = "";
  
  // get the ball rolling
  ballMove = true;
};


const joinGame = () => {
  console.log('join GAME clicked');
  socket.emit('requestAccess', {});
};

const joinRoom = () => {
  if(document.querySelector('.joinName').value) {
    const roomName = document.querySelector('.joinName').value;
    console.log('join ROOM clicked');
    socket.emit('joinRoom', { roomName: roomName });
  } else {
    return;
  }
};

const hostRoom = () => {
  if(document.querySelector('.hostName').value) {
    const roomName = document.querySelector('.hostName').value;
    console.log('host ROOM clicked');
    socket.emit('hostRoom', { roomName: roomName });
  } else {
    return;
  }
  
};

const init = () => {
 
  canvas = document.querySelector('#canvas');
  ctx = canvas.getContext('2d');

  socket = io.connect();
  
  socket.on('connect', () => {
    
    console.log('connected');
    
    socket.on('joined', setUser);
    socket.on('removeWaitMessage', removeWaitMessage);
    socket.on('updatedMovement', update);
    socket.on('left', removeUser);
  //  // gives the player a point if they earned it in the last round
  //  // checks if the player won the game
  //  socket.on('givePoint', updateScore);
  //  
  //  // ends the game
  //  socket.on('endGame', endGame);
  //
    document.querySelector('#joinButton').onclick = joinGame;
    document.querySelector('.hostNameButton').onclick = hostRoom;
    document.querySelector('.joinNameButton').onclick = joinRoom;
    document.body.addEventListener('keydown', keyDownHandler);
    document.body.addEventListener('keyup', keyUpHandler);
  });
  
};

window.onload = init;



















