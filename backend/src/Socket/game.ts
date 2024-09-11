import { Server } from 'socket.io';
export default (io: Server) => {
    io.on('connection', (socket) => {
        socket.on("rollDice", (payload) => {
            console.log("Dice rolled");
        });
       
      
    });
  };