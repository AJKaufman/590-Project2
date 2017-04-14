"use strict";

var directions = {
  DOWNLEFT: 0,
  DOWN: 1,
  DOWNRIGHT: 2,
  LEFT: 3,
  UPLEFT: 4,
  RIGHT: 5,
  UPRIGHT: 6,
  UP: 7
};

var spriteSizes = {
  WIDTH: 31,
  HEIGHT: 121
};

var lerp = function lerp(v0, v1, alpha) {
  return (1 - alpha) * v0 + alpha * v1;
};

var redraw = function redraw(time) {
  updatePosition();

  ctx.clearRect(0, 0, 1000, 1000);

  var keys = Object.keys(squares);

  for (var i = 0; i < keys.length; i++) {

    var square = squares[keys[i]];

    //if alpha less than 1, increase it by 0.05
    if (square.alpha < 1) square.alpha += 0.05;

    if (square.hash === hash) {
      ctx.filter = "none";
    } else {
      ctx.filter = "hue-rotate(40deg)";
    }

    square.x = lerp(square.prevX, square.destX, square.alpha);
    square.y = lerp(square.prevY, square.destY, square.alpha);

    // if we are mid animation or moving in any direction
    if (square.frame > 0 || square.moveUp || square.moveDown) {
      square.frameCount++;

      if (square.frameCount % 8 === 0) {
        if (square.frame < 7) {
          square.frame++;
        } else {
          square.frame = 0;
        }
      }
    }

    ctx.fillStyle = 'white';
    ctx.strokeStyle = '#1238CC';

    // draw ball and local paddle
    if (ball) {
      ctx.fillRect(ball.x - 25, square.y - 25, 50, 50);
    }
    ctx.fillRect(square.x, square.y, spriteSizes.WIDTH, spriteSizes.HEIGHT);

    ctx.strokeRect(square.x, square.y, spriteSizes.WIDTH, spriteSizes.HEIGHT);
  }

  animationFrame = requestAnimationFrame(redraw);
};
'use strict';

// Credit to 590-Project1 by Aidan Kaufman and simple-server-collision by Cody Van De Mark
var canvas = void 0;
var ctx = void 0;
var walkImage = void 0;
var slashImage = void 0;
//our websocket connection
var socket = void 0;
var hash = void 0;
var animationFrame = void 0;
var squares = {};
var attacks = [];
var myScore = void 0;
var oScore = void 0;
var myRoom = void 0;
var side = void 0;
var ball = void 0;
var ballMove = void 0;

// The reload function. 
// Seperated due to the automatic initiation due to ES6 syntax
var reload = function reload() {
  window.location.reload();
};

var keyDownHandler = function keyDownHandler(e) {
  var keyPressed = e.which;
  var square = squares[hash];

  // W OR UP
  if (keyPressed === 87 || keyPressed === 38) {
    square.moveUp = true;
  }
  // S OR DOWN
  else if (keyPressed === 83 || keyPressed === 40) {
      square.moveDown = true;
    }
};

var keyUpHandler = function keyUpHandler(e) {
  var keyPressed = e.which;
  var square = squares[hash];

  // W OR UP
  if (keyPressed === 87 || keyPressed === 38) {
    square.moveUp = false;
  }
  // S OR DOWN
  else if (keyPressed === 83 || keyPressed === 40) {
      square.moveDown = false;
    }
};

var removeWaitMessage = function removeWaitMessage() {
  // update innerHTML
  var content = document.querySelector('#mainMessage');
  content.innerHTML = "";
  var displayScore = document.querySelector('#score');
  displayScore.innerHTML = '<div style="float: left; padding-left: 20%; padding-top: 2%;">' + myScore;
  displayScore.innerHTML += '</div> <div style="float: right; padding-right: 20%; padding-top: 2%;">' + oScore + "</div>";
  var signIn = document.querySelector('#signIn');
  signIn.innerHTML = "";
  var jButt = document.querySelector('#joinButton');
  jButt.innerHTML = "";
  var hrb = document.querySelector('#hostRoomButton');
  hrb.innerHTML = "";
  var jrb = document.querySelector('#joinRoomButton');
  jrb.innerHTML = "";

  // get the ball rolling
  ballMove = true;
};

var joinGame = function joinGame() {
  console.log('join GAME clicked');
  socket.emit('requestAccess', {});
};

var joinRoom = function joinRoom() {
  if (document.querySelector('.joinName').value) {
    var roomName = document.querySelector('.joinName').value;
    console.log('join ROOM clicked');
    socket.emit('joinRoom', { roomName: roomName });
  } else {
    return;
  }
};

var hostRoom = function hostRoom() {
  if (document.querySelector('.hostName').value) {
    var roomName = document.querySelector('.hostName').value;
    console.log('host ROOM clicked');
    socket.emit('hostRoom', { roomName: roomName });
  } else {
    return;
  }
};

var init = function init() {

  canvas = document.querySelector('#canvas');
  ctx = canvas.getContext('2d');

  socket = io.connect();

  socket.on('connect', function () {

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
'use strict';

var update = function update(data) {

  // if the square doesn't already exist, make it so!
  if (!squares[data.square.hash]) {
    console.log('new square created');
    squares[data.square.hash] = data;
    return;
  }

  // if it's the same hash as the client, skip this because you already moved locally
  if (data.square.hash === hash) {
    return;
  }

  // if lastUpdate didn't work correctly skip
  if (squares[data.square.hash].lastUpdate >= data.lastUpdate) {
    console.log('lastUpdate did not work correctly');
    return;
  }

  var square = squares[data.square.hash];
  square.prevX = data.prevX;
  square.prevY = data.prevY;
  square.destY = data.destY;
  square.direction = data.direction;
  square.moveLeft = data.moveLeft;
  square.moveRight = data.moveRight;
  square.moveDown = data.moveDown;
  square.moveUp = data.moveUp;
  square.alpha = 0.05;
};

var removeUser = function removeUser(data) {
  if (squares[data.hash]) {
    delete squares[data.hash];
  }
};

var setUser = function setUser(data) {

  if (!hash) {

    console.log('setting user, first instance of hash');

    myScore = 0;
    oScore = 0;
    hash = data.player.hash;
    myRoom = data.room;
    squares[hash] = data.player;
    side = data.side;

    console.log(side);

    if (data.side === 1) {
      squares[hash].prevX = 940;
      squares[hash].x = 940;
      squares[hash].destX = 940;
      socket.emit('waitMessage', data);
    } else {
      squares[hash].prevX = 30;
      squares[hash].x = 30;
      squares[hash].destX = 30;
      var score = document.querySelector('#score');
      score.innerHTML = "<p>Waiting for your opponent...</p>";
      var signIn = document.querySelector('#signIn');
      signIn.innerHTML = "";
      var jButt = document.querySelector('#joinButton');
      jButt.innerHTML = "";
      var hrb = document.querySelector('#hostRoomButton');
      hrb.innerHTML = "";
      var jrb = document.querySelector('#joinRoomButton');
      jrb.innerHTML = "";

      ballMove = false;
    }

    // make the ball
    ball = {};
    ball.x = canvas.width / 2;
    ball.y = canvas.height + canvas.offsetHeight;
    ball.prevX = canvas.width / 2;
    ball.prevY = canvas.height + canvas.offsetHeight;
    ball.destX = canvas.width / 2;
    ball.destY = canvas.height + canvas.offsetHeight;

    requestAnimationFrame(redraw);
  }
};

var sendHit = function sendHit() {
  var square = squares[hash];

  var hit = {
    hash: hash,
    x: square.x,
    y: square.y,
    frames: 0
  };

  socket.emit('hit', hit);
};

var updateScore = function updateScore(data) {
  if (data.hash === hash) {
    myScore += 1;
    console.log('My score is: ' + myScore);
  }

  if (myScore > 9) {
    console.log('I win!');
    socket.emit('sendVictor', { room: myRoom, winner: userName });
  }
};

var endGame = function endGame(data) {
  console.log('endgame accomplished!');

  var signIn = document.querySelector('#signIn');
  signIn.innerHTML = "";
  var content = document.querySelector('#mainMessage');
  content.innerHTML = "<b>" + data.winner + " is the winner!!!!</b>";

  content.innerHTML += "<br /> <input id='restart' type='button' value='Enter new game?' />";

  // restart button
  var restartButton = document.querySelector('#restart');
  restartButton.addEventListener('click', reload);
};

var updatePosition = function updatePosition() {
  var square = squares[hash];

  square.prevY = square.y;

  if (square.moveUp && square.destY > 0) {
    square.destY -= 10;
  }
  if (square.moveDown && square.destY < 480) {
    square.destY += 10;
  }

  square.alpha = 0.05;

  var squareData = {};

  if (side === 2) {

    ball.prevX = ball.x;
    ball.prevY = ball.y;

    if (ballMove) {
      ball.destX += 1;
      ball.destY += 1;
    }

    squareData.square = square;
    squareData.room = myRoom;
    squareData.ball = ball;
  } else {

    squareData.square = square;
    squareData.room = myRoom;
  }

  socket.emit('movementUpdate', squareData);
};
