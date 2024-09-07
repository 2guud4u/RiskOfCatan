import lobbySocket from './lobbySocket';
import { Server } from 'socket.io';

export default (io: Server) => {
    lobbySocket(io);
  };