const express = require("express");
const socket = require("socket.io");
const { join } = require('path');
const Events = require('game-events');

// App setup
const app = express();

app.use(express.static(join(__dirname, '..', 'client', 'build')));

const server = app.listen(4000, function () {
  console.log("listening for requests on port 4000");
});

// app.use(express.static("public"));

// Socket setup & pass server
const io = socket(server);

io.on("connection", (socket) => {
  console.log("made socket connection", socket.id);
  const rooms = io.sockets.adapter.rooms;
  socket.emit(Events.ListRooms, rooms);

  // emit to the one user socket
  //   socket.emit("test", {
  //     user: "foo",
  //     msg: "This is foo sending a secret message",
  //   });
  // emit to every user including the current user
  // io.emit('test', {user: 'foo', msg: 'This is foo sending a secret message'});
  // emit to all users except the current
  // socket.broadcast.emit('test', {user: 'foo', msg: 'This is foo sending a secret message'});

  socket.on("newState", data => {
    io.emit("newState", data);
  });
});
