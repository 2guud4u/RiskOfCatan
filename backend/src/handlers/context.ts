import { Server, Socket } from 'socket.io';

/**
 * Shared context handed to each domain handler module. Each module registers its
 * own socket handlers on the connection, keeping the entrypoint thin.
 */
export interface HandlerContext {
  io: Server;
  socket: Socket;
}
