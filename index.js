var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var shortid = require('shortid');

var port = process.env.PORT || 9876;

io.on('connection', function(socket){

  // When a new user connects then we output a log
  console.log('A user has connected: ' + socket.id);

  // When the server receives a new message to send we broadcast it to the other users on the server
  socket.on('new message', function(message){
    // Broadcast will send to all users except the client that sent the message
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: message,
      avatar: socket.avatar,
      messageClass: "from-them blackText"
    });
  });
  
  // When a user disconnects then log that to the server
  socket.on('disconnect', function(){
    console.log('User: ' + socket.username + ' has disconnected.' + socket.id);
    socket.broadcast.emit('user disconnected', { username: socket.username });
  });
  
  socket.on('typing', function(){
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  socket.on('stop typing', function(){
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });
  
  // When a new user is registered (they make a username), set their username on the server.
  socket.on('add user', function(username){
    socket.username = username;
  });

  // When a user adds a custom avatar it sets it on the server.
  socket.on('add avatar', function(avatar){
    socket.avatar = avatar;
    console.log("add new avatar" + socket.avatar);
  });
  
  // When a new user joins broadcast it to the other users on the server
  // Also set the servers username.
  socket.on('user join', function(username){
    socket.username = username;
    if (socket.username) {
      console.log("on user joined will broadcast that user '" + socket.username + "' joined.");
      socket.broadcast.emit('user join', username);
    }
  })
});

// Create the server - log the port number we are using
server.listen(port, function(){
  console.log('listening on *:' + port);
});