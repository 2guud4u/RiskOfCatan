import { Server } from 'socket.io';
import { addPlayer } from '../Controller/Game';

export default (io: Server) => {
    io.on('connection', (socket) => {
     socket.on('joinRoom', (payload) => {
       socket.join(payload.room);
       console.log(`User ${socket.id} name ${payload.name} joined room ${payload.room}`);
       addPlayer(payload.room, payload.name, "red").then((res) => {
            console.log(res);
            socket.emit('joinedRoom', {room: payload.room, players: res.players});
        });

     });
        
      
    });
  };