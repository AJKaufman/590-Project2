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
let socket;
let myScore;
let myRoom;
let player;

const connect = () => {
  myScore = 0;
    const signIn = document.querySelector('#signIn');
    signIn.innerHTML = "<p>Waiting for your opponent...</p>";

    socket.emit('join', { });
}

const setupSocket = () => {

  socket = io.connect();


  // begin setting up the room, save the room name client side
  socket.on('startRoom', (data) => {

    console.log('started room');
    console.log(data.player);
    myRoom = data.room;
    player = data.player;

    let content = document.querySelector('#mainMessage');
    content.innerHTML = "";
    let displayScore = document.querySelector('#score');
    displayScore.innerHTML = 'My score: ' + myScore;
    
    
  });
  
  // gives the player a point if they earned it in the last round
  // checks if the player won the game
  socket.on('givePoint', (data) => {
    if(data.name === userName) {
      myScore += 1;
      console.log('My score is: ' + myScore);
    }
    
    if(myScore > 9) {
      console.log('I win!');
      socket.emit('sendVictor', { room: myRoom, winner: userName } );
    }
    
  });
  
  
  // ends the game
  socket.on('endGame', (data) => {
    console.log('endgame accomplished!');
    
    const signIn = document.querySelector('#signIn');
    signIn.innerHTML = "";
    const content = document.querySelector('#mainMessage');
    content.innerHTML = "<b>" + data.winner + " is the winner!!!!</b>";
    
    content.innerHTML += "<br /> <input id='restart' type='button' value='Enter new game?' />"
    
    // restart button
    const restartButton = document.querySelector('#restart');
    restartButton.addEventListener('click', reload);
    
  });
};


// The reload function. 
// Seperated due to the automatic initiation due to ES6 syntax
const reload = () => {
  window.location.reload();
};


//const update = () => {
//  if(dragging) {
//    const time = new Date().getTime();
//    const data = {
//      x: 0,
//      y: 0,
//      height: canvas.height,
//      width: canvas.width,
//      imgData: topCanvas.toDataURL(), // get pixel data from canvas
//    };
//    socket.emit('draw', data);
//  }
//};
//







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

  // setup the socket
  const connect = document.querySelector('#connect');
  connect.addEventListener('click', setupSocket); 
  
  socket.on('joined', setUser);
  socket.on('updatedMovement', update);
  socket.on('left', removeUser);
  socket.on('connect', connect);
  
  document.body.addEventListener('keydown', keyDownHandler);
  document.body.addEventListener('keyup', keyUpHandler);
};

window.onload = init;