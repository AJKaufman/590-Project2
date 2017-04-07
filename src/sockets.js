// Credit to 590-Project1 by Aidan Kaufman and simple-server-collision by Cody Van De Mark
const xxh = require('xxhashjs');
const Player = require('./classes/Player.js');
const physics = require('./physics.js');

const players = {};
// num to hold all of our connected users
const roomList = {};
let nextRoom = 0;
let currentRoomCount = 1;

let io;

const directions = {
  DOWNLEFT: 0,
  DOWN: 1,
  DOWNRIGHT: 2,
  LEFT: 3,
  UPLEFT: 4,
  RIGHT: 5,
  UPRIGHT: 6,
  UP: 7,
};


const setupSockets = (ioServer) => {
  io = ioServer;

  io.on('connection', (sock) => {
    const socket = sock;

    // new user in this room
    currentRoomCount++;
    
    // send the user to their room
    socket.join(`room${nextRoom}`);


    // if the room isn't in the roomList
    if (!roomList[`room${nextRoom}`]) {
      console.log(`adding room${nextRoom} to roomList`);
      roomList[`room${nextRoom}`] = {};
    }

    // generate the user's unique hash code
    const idString = `${socket.id}${new Date().getTime()}`;
    const hash = xxh.h32(idString, 0xCAFEBABE).toString(16);

    
    socket.hash = hash;

    
    players[hash] = new Player(hash);

    io.sockets.in(`room${nextRoom}`).emit('joined', {
      player: players[hash],
      side: currentRoomCount,
      room: `room${nextRoom}`,
    });
    
    // create the playerData and send back left or right side
    if (currentRoomCount >= 2) {
      currentRoomCount = 0;
      
      console.log("left");
    } else {
      nextRoom++;
      
      console.log("right");
    }
    

    socket.on('movementUpdate', (data) => {
      players[socket.hash] = data.square;
      players[socket.hash].lastUpdate = new Date().getTime();

      physics.setPlayer(players[socket.hash]);
      
      io.sockets.in(data.room).emit('updatedMovement', players[socket.hash]);
    });

    socket.on('hit', (data) => {
      const hit = data;

      let handleHitEvent = true;

      switch (hit.direction) {
        case directions.DOWN: {
          hit.width = 66;
          hit.height = 183;
          hit.y += 183;
          break;
        }
        case directions.LEFT: {
          hit.width = 183;
          hit.height = 66;
          hit.x -= 183;
          break;
        }
        case directions.UP: {
          hit.width = 66;
          hit.height = 183;
          hit.y -= 183;
          break;
        }
        case directions.RIGHT: {
          hit.width = 183;
          hit.height = 66;
          hit.x += 183;
          break;
        }
        default: {
          handleHitEvent = false;
        }
      }

      if (handleHitEvent) {
        io.sockets.in('room1').emit('hitUpdate', hit);
        physics.addHit(hit);
      }
    });

    socket.on('disconnect', () => {
      io.sockets.in('room1').emit('left', players[socket.hash]);

      delete players[socket.hash];

      physics.setPlayerList(players);

      socket.leave('room1');
    });
  });
};

console.log('Websocket server started');


module.exports.setupSockets = setupSockets;
