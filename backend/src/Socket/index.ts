import lobbySocket from './lobby';
import gameSocket from './game';

import { Server } from 'socket.io';

export default (io: Server) => {
    console.log("Socket.io started");
    lobbySocket(io);
    gameSocket(io);
  };