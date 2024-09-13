import { Server } from 'socket.io';
import {generateBoardAndSave} from '../Controller/Game';

export default (io: Server) => {
    io.on('connection', (socket) => {
        socket.on("rollDice", (payload) => {
            console.log("Dice rolled");
        });
       
        socket.on('startGame', (payload) => {
            console.log('Game started');
            io.to(payload.room).emit('gameStarted');
        });

        socket.on("generateBoard", (payload) => {
            const { radius, roomId } = payload;
            console.log("Generating board");
            generateBoardAndSave(roomId, radius).then((board) => {
            if(board){
                io.to(roomId).emit('generateBoardResult', board);

            }
            console.log(board);
        });


        });
    });
  };


function updateGameState(){
    return;
}