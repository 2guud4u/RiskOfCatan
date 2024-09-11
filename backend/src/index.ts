import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

import { getHexagonCoords,createCoordsMap } from './Services/Game';
import { addPlayer } from './Controller/Game';
import connectDB from './config/db';

import SocketSetup from './Socket/index';
const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: { origin : 'http://localhost:3000',}
});

connectDB();
SocketSetup(io);



server.listen(5000, () => {
  console.log('server running at http://localhost:5000');
});

// io.to('some room').emit('some event'); sends to all users in 'some room'

// socket.emit('some event'); sends to the unique socket connected to the server
// socket.to('some room').emit('some event'); sends to all users in 'some room' except the sender