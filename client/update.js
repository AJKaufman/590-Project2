const update = (data) => {
  
  
  // if the square doesn't already exist, make it so!
  if(!squares[data.hash]) {
    console.log('new square created');
    squares[data.hash] = data;
    return;
  }
  
  // if it's the same hash as the client, skip this because you already moved locally
  if(data.hash === hash) {
    return;
  }

  // if lastUpdate didn't work correctly skip
  if(squares[data.hash].lastUpdate >= data.lastUpdate) {
    console.log('lastUpdate did not work correctly');
    return;
  }

  const square = squares[data.hash];
  square.prevX = data.prevX;
  square.prevY = data.prevY;
  square.destX = data.destX;
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
    myScore = 0;  
    hash = data.player.hash;
    myRoom = data.room;
    squares[hash] = data.player;

    if(data.side === 1) {
      squares[hash].prevX += 490;
      squares[hash].x += 490;
    }

    // update innerHTML
    const signIn = document.querySelector('#signIn');
    //signIn.innerHTML = "<p>Waiting for your opponent...</p>";  
    let content = document.querySelector('#mainMessage');
    content.innerHTML = "";
    let displayScore = document.querySelector('#score');
    displayScore.innerHTML = 'My score: ' + myScore;

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
    square.destY -= 2;
  }
  if(square.moveDown && square.destY < 400) {
    square.destY += 2;
  }

  square.alpha = 0.05;

  const squareData = {
    square: square,
    room: myRoom,
  };
  
  socket.emit('movementUpdate', squareData);
};



















