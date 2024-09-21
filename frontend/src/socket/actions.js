
import { socket } from './socket';

export const sendRollDice = (room) => {
    console.log("client rolled")
    socket.emit('rollDice', {roomId: room});
   
}