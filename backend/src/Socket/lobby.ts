import { Socket ,Server } from 'socket.io';
import { addPlayer, removePlayer, getPlayers } from '../Controller/Game';
import { get } from 'node:http';

export default (io: Server) => {
    io.on('connection', (socket) => {
        
        socket.on('joinRoom', (payload) => {
            socket.join(payload.room);

        });

        socket.on('leaveRoom', (payload) => {
            socket.leave(payload.room);
            console.log(`User ${socket.id} left room ${payload.room}`);
            removePlayer(payload.room, socket.id).then((res) => {
                console.log(res);
                socket.to(payload.room).emit('message', `User ${socket.id} has left the room`);
            });
            
        });
        
        socket.on("addPlayer", (payload) => {
            
            
            addPlayer(payload.room, payload.name, "red").then((res) => {
                console.log(res, payload);
                io.to(payload.room).emit('updatePlayerList', {players: res.players});
                console.log(`User ${socket.id} joined room ${payload.room}`);
            });
            
        });
        
        socket.on('startGame', (payload) => {
            console.log('Game started');
            io.to(payload.room).emit('gameStarted');
        });
      
    });
  };

export const emitUpdatePlayerList = (io: Server ,room: string, players: any[]) => {
    io.to(room).emit('updatePlayerList', {players: players});

};