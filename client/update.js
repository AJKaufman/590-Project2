const update = (data) => {
  if(!squares[data.hash]) {
    squares[data.hash] = data;
    return;
  }

  if(data.hash === hash) {
    return;
  }

  if(squares[data.hash].lastUpdate >= data.lastUpdate) {
    return;
  }

  const square = squares[data.hash];
  square.prevY = data.prevY;
  square.destY = data.destY;
  square.direction = data.direction;
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
  hash = data.player.hash;
  myRoom = data.room;
  squares[hash] = data.player;
  requestAnimationFrame(redraw);
};

const sendHit = () => {
  const square = squares[hash];
  
  const hit = {
    hash: hash,
    y: square.y,
    frames: 0,
  };
  
  socket.emit('hit', hit);
};


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



















