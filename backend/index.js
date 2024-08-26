import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin : 'http://localhost:3000',}
});


const __dirname = dirname(fileURLToPath(import.meta.url));



app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
      });
    // Handle joining a room
  socket.on('joinRoom', (payload) => {
    socket.join(payload.room);
    console.log(`User ${socket.id} name ${payload.name} joined room ${payload.room}`);
    socket.emit('joinedRoom', {room: payload.room});
  });

  // Handle leaving a room
  socket.on('leaveRoom', (room) => {
    socket.leave(room);
    console.log(`User ${socket.id} left room ${room}`);
    socket.to(room).emit('message', `User ${socket.id} has left the room`);
  });
  socket.on('sendMessage', (room, message) => {
    console.log(`User ${socket.id} sent message to room ${room}: ${message}`);
    io.to(room).emit('message', message);
  });
});

server.listen(5000, () => {
  console.log('server running at http://localhost:5000');
});

// io.to('some room').emit('some event'); sends to all users in 'some room'

// socket.emit('some event'); sends to the unique socket connected to the server
// socket.to('some room').emit('some event'); sends to all users in 'some room' except the sender