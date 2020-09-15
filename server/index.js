var express = require("express");
var socket = require("socket.io");
const path = require('path');
// App setup
var app = express();
var server = app.listen(4000, function () {
  console.log("listening for requests on port 4000,");
});

// // Static files
// app.use(express.static("public"));
app.use(express.static("../client/build"));

// Socket setup & pass server
var io = socket(server);
io.on("connection", (socket) => {
  console.log("made socket connection", socket.id);
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
  })
});

// app.use(express.static('../client/build'));