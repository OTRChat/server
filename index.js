const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 9876;

io.on('connection', (socket) => {
  // When a new user connects then we output a log
  console.log(`A user has connected: ${socket.id}`);

  // When a new user joins broadcast it to the other users on the server
  // Also set the servers username.
  socket.on('user join', (username) => {
    socket.username = username;
    if (socket.username) {
      console.log(`Broadcasting user '${username}' joined.`);
      socket.broadcast.emit('user join', username);
    }
  });

  // When a user disconnects then log that to the server
  socket.on('disconnect', () => {
    console.log(`User: ${socket.username} has disconnected. ${socket.id}`);
    socket.broadcast.emit('user disconnected', { username: socket.username });
  });

  // When the server receives a new message to send we broadcast it to the other users on the server
  socket.on('new message', (message) => {
    // Broadcast will send to all users except the client that sent the message

    console.log(message);
    socket.broadcast.emit('new message', {
      username: socket.username,
      message,
      avatar: socket.avatar,
      messageClass: 'from-them blackText',
    });
  });

  //   socket.on('typing', () => {
  //     socket.broadcast.emit('typing', {
  //       username: socket.username,
  //     });
  //   });
  //   socket.on('stop typing', () => {
  //     socket.broadcast.emit('stop typing', {
  //       username: socket.username,
  //     });
  //   });
  //   // When a new user is registered (they make a username), set their username on the server.
  //   socket.on('add user', (username) => {
  //     socket.username = username;
  //   });
  //   // When a user adds a custom avatar it sets it on the server.
  //   socket.on('add avatar', (avatar) => {
  //     socket.avatar = avatar;
  //     console.log(`add new avatar ${socket.avatar}`);
  //   });
});

// Create the server - log the port number we are using
exports.server = server.listen(port, () => {
  console.log(`listening on *: ${port}`);
});
