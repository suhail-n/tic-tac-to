const express = require("express");
const socket = require("socket.io");
const { join } = require('path');
const Events = require('game-events');
const { pseudoRandomBytes } = require('crypto');

// App setup
const app = express();

app.use(express.static(join(__dirname, '..', 'client', 'build')));

const server = app.listen(4000, function () {
  console.log("listening for requests on port 4000");
});

const io = socket(server);
const rooms = {};
let socks = [];

const getRooms = () => Object
  .entries(io.sockets.adapter.rooms)
  .filter(([roomId]) => !socks.includes(roomId))
  .reduce((p, n) => ({ ...p, [n[0]]: n[1] }), {});

io.on("connection", socket => {
  console.log("made socket connection", socket.id);
  socks = Object.keys(io.sockets.sockets);

  socket.on(Events.CreateRoom, (displayName) => {
    const key = pseudoRandomBytes(16).toString('hex');
    rooms[key] = displayName || key;
    console.log('Created room', rooms[key]);
    socket.join(key);
    socket.emit(Events.RoomCreated, key);
  });

  socket.on(Events.JoinRoom, roomId => {
    if (rooms[roomId]) {
      socket.join(roomId);
      socket.emit(Events.RoomJoined, roomId);
    }
  });

  socket.on(Events.LeaveRoom, roomId => {
    // TODO: Only delete after everyone is gone
    delete rooms[roomId];
    socket.leave(roomId);
  });

  socket.on('disconnect', () => {
    socks = socks.filter(socketId => socketId !== socket.id);
  });

  socket.on("newState", data => {
    io.emit("newState", data);
  });

  const _rooms = getRooms();
  console.log('socks', socks);
  console.log('rooms', _rooms);
  socket.emit(Events.ListRooms, getRooms());
});
