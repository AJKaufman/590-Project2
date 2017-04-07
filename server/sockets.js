const xxh = require('xxhashjs');
const Character = require('./classes/Character.js');
const physics = require('./physics.js');

const characters = {};

let io;

const setupSockets = (ioServer) => {
  io = ioServer;

  io.on('connection', (sock) => {
    const socket = sock;

    socket.join('room1');
    const idString = `${socket.id}${new Date().getTime()}`;
    const hash = xxh.h32(idString, 0xCAFEBABE).toString(16);
    characters[hash] = new Character(hash);

    socket.hash = hash;

    socket.emit('joined', characters[hash]);

    socket.on('movementUpdate', (data) => {
      const dataAfterGrav = data;
      // gravity????
      if (data.y < 395) {
        dataAfterGrav.y++;
        console.log(dataAfterGrav.y);
      }

      characters[socket.hash] = dataAfterGrav;
      characters[socket.hash].lastUpdate = new Date().getTime();

      physics.setCharacter(characters[socket.hash]);

      io.sockets.in('room1').emit('updatedMovement', { charID: characters[socket.hash], newY: dataAfterGrav.y });
    });

    socket.on('disconnect', () => {
      io.sockets.in('room1').emit('left', characters[socket.hash]);

      delete characters[socket.hash];

      physics.setCharacterList(characters);

      socket.leave('room1');
    });
  });
};

module.exports.setupSockets = setupSockets;
