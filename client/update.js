const update = (data) => {
  
  
  // if the square doesn't already exist, make it so!
  if(!squares[data.square.hash]) {
    console.log('new square created');
    squares[data.square.hash] = data;
    return;
  }
  
  // if it's the same hash as the client, skip this because you already moved locally
  if(data.square.hash === hash) {
    return;
  }

  // if lastUpdate didn't work correctly skip
  if(squares[data.square.hash].lastUpdate >= data.lastUpdate) {
    console.log('lastUpdate did not work correctly');
    return;
  }
  
  const square = squares[data.square.hash];
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

const removeUser = (data) => {
  if(squares[data.hash]) {
    delete squares[data.hash];
  }
};

const setUser = (data) => {
    
  if(!hash){
    
    console.log('setting user, first instance of hash');
    
    myScore = 0;
    oScore = 0;
    hash = data.player.hash;
    myRoom = data.room;
    squares[hash] = data.player;
    side = data.side;
    
    console.log(side);
    
    if(data.side === 1) {
      squares[hash].prevX = 940;
      squares[hash].x = 940;
      squares[hash].destX = 940;
      socket.emit('waitMessage', (data));
    } else {
      squares[hash].prevX = 30;
      squares[hash].x = 30;
      squares[hash].destX = 30;
      const score = document.querySelector('#score');
      score.innerHTML = "<p>Waiting for your opponent...</p>";
      const signIn = document.querySelector('#signIn');
      signIn.innerHTML = "";
      const jButt = document.querySelector('#joinButton');
      jButt.innerHTML = "";  
      const hrb = document.querySelector('#hostRoomButton');
      hrb.innerHTML = "";
      const jrb = document.querySelector('#joinRoomButton');
      jrb.innerHTML = "";
      
      
      ballMove = false;
    }
    
    // make the ball
    ball = {};
    ball.x = canvas.width/2;
    ball.y = canvas.height + canvas.offsetHeight;
    ball.prevX = canvas.width/2;
    ball.prevY = canvas.height + canvas.offsetHeight;
    ball.destX = canvas.width/2;
    ball.destY = canvas.height + canvas.offsetHeight;
    
    requestAnimationFrame(redraw);
  } 
  
  
};

const sendHit = () => {
  const square = squares[hash];
  
  const hit = {
    hash: hash,
    x: square.x,
    y: square.y,
    frames: 0,
  };
  
  socket.emit('hit', hit);
};

const updateScore = (data) => {
  if(data.hash === hash) {
      myScore += 1;
      console.log('My score is: ' + myScore);
    }
    
    if(myScore > 9) {
      console.log('I win!');
      socket.emit('sendVictor', { room: myRoom, winner: userName } );
    }
};

const endGame = (data) => {
  console.log('endgame accomplished!');
    
  const signIn = document.querySelector('#signIn');
  signIn.innerHTML = "";
  const content = document.querySelector('#mainMessage');
  content.innerHTML = "<b>" + data.winner + " is the winner!!!!</b>";

  content.innerHTML += "<br /> <input id='restart' type='button' value='Enter new game?' />"

  // restart button
  const restartButton = document.querySelector('#restart');
  restartButton.addEventListener('click', reload);
}

const updatePosition = () => {
  const square = squares[hash];

  
  square.prevY = square.y;

  if(square.moveUp && square.destY > 0) {
    square.destY -= 10;
  }
  if(square.moveDown && square.destY < 480) {
    square.destY += 10;
  }

  square.alpha = 0.05;

  const squareData = {};
  
  if(side === 2) {
    
    ball.prevX = ball.x;
    ball.prevY = ball.y;
    
    if(ballMove) {
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



















