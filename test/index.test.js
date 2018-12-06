import { expect } from 'chai';

const io = require('socket.io-client'); //eslint-disable-line

const options = {
  'force new connection': true,
  transports: ['websocket'],
};

const socketUrl = 'http://localhost:9876';

const chatUser1 = { username: 'User1' };
const chatUser2 = { username: 'User2' };
const chatUser3 = { username: 'User3' };
const testMessage = 'test message';

let client1;
let client2;

describe('Connecting and Disconnecting', () => {
  beforeEach((done) => {
    client1 = io(socketUrl, options);
    client2 = io(socketUrl, options);
    client1.on('connect', () => {
      client1.emit('user join', chatUser1.username);
      client2.on('connect', () => {
        client2.emit('user join', chatUser2.username);
        done();
      });
    });
  });

  afterEach((done) => {
    client1.disconnect();
    client2.disconnect();
    done();
  });

  it('Broadcasts newly joined user to other users', (done) => {
    client2.on('user join', (username) => {
      expect(username).to.equal(chatUser1.username);
      done();
    });
  });

  it('Broadcasts when user gets disconnected', (done) => {
    const client3 = io(socketUrl, options);
    client3.on('connect', () => {
      client3.emit('user join', chatUser3.username);
      client3.disconnect();

      client1.on('user disconnected', (username) => {
        expect(username).to.eql({ username: chatUser3.username }); // deep equal
        done();
      });
    });
  });

  it("Saves an avatar when it's uploaded", (done) => {
    done();
  });
});

describe('Messaging', () => {
  beforeEach((done) => {
    client1 = io(socketUrl, options);
    client1.on('connect', () => {
      client1.emit('user join', chatUser1.username);

      client2 = io(socketUrl, options);
      client2.on('connect', () => {
        client2.emit('user join', chatUser2.username);
        done();
      });
    });
  });

  afterEach((done) => {
    client1.disconnect();
    client2.disconnect();
    done();
  });

  it('Broadcasts new chat message to other users', (done) => {
    client1.emit('new message', testMessage);

    client2.on('new message', (msg) => {
      expect(msg.username).to.equal(chatUser1.username);
      expect(msg.message).to.equal(testMessage);
      expect(msg.messageClass).to.equal('from-them blackText');
      done();
    });
  });

  it('Notifies clients when a user is typing', (done) => {
    client1.emit('typing');

    client2.on('typing', (username) => {
      expect(username).to.eql({ username: chatUser1.username });
      client1.emit('stop typing');
      done();
    });
  });

  it('Notifies clients when a user stops typing', (done) => {
    client1.emit('stop typing');

    client2.on('stop typing', (username) => {
      expect(username).to.eql({ username: chatUser1.username });
      done();
    });
  });
});
