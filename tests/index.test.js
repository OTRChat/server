import { expect } from 'chai';

const io = require('socket.io-client'); //eslint-disable-line

const ioOptions = {
  'reconnection delay': 0,
  'reopen delay': 0,
  'force new connection': true,
  transports: ['websocket'],
};

const socketURL = 'http://localhost:9876';

const chatUser1 = { name: 'Tom' };
const chatUser2 = { name: 'Sally' };
const chatUser3 = { name: 'Dana' };

describe('Chat Server', () => {
  it('Should broadcast new user to all users', (done) => {
    const client1 = io.connect(
      socketURL,
      ioOptions
    );
    client1.on('connect', () => {
      client1.emit('user join', chatUser1);

      const client2 = io.connect(
        socketURL,
        ioOptions
      );

      client2.on('connect', () => {
        client2.emit('user join', chatUser2);
      });

      client2.on('user join', (usersName) => {
        expect(usersName).to.be.equal.to(chatUser2.name);
        client2.disconnect();
      });
    });

    done();
  });
});

// import ioBack from 'socket.io';
// import http from 'http';

// let socket;
// let httpServer;
// let ioServer;
// const ioOptions = {
//   'reconnection delay': 0,
//   'reopen delay': 0,
//   'force new connection': true,
//   transports: ['websocket'],
// };

// beforeAll((done) => {
//   httpServer = http.createServer().listen();
//   httpServer.listen().address();
//   ioServer = ioBack(httpServer);
//   done();
// });

// afterAll((done) => {
//   ioServer.close();
//   httpServer.close();
//   done();
// });

// beforeEach((done) => {
//   // Setup
//   socket = io.connect(
//     'http://localhost:9876/',
//     ioOptions
//   );
//   socket.on('connect', () => {
//     done();
//   });
// });

// afterEach((done) => {
//   // Cleanup
//   if (socket.connected) {
//     socket.disconnect();
//   }
//   done();
// });

// describe('basic test', () => {
//   test('should communicate', (done) => {
//     ioServer.emit('message', 'Hello World');
//     socket.once('message', (message) => {
//       expect(message).toBe('Hello World');
//       done();
//     });
//     ioServer.on('connection', (mySocket) => {
//       expect(mySocket).toBeDefined();
//     });
//   });

//   test('should communicate with waiting for socket.io handshakes', (done) => {
//     // Emit sth from Client do Server
//     socket.emit('examlpe', 'some messages');
//     // Use timeout to wait for socket.io server handshakes
//     setTimeout(() => {
//       // Put your server side expect() here
//       done();
//     }, 50);
//   });
// });
