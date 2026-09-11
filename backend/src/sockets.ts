import { Server } from 'socket.io';

import { registerRoomHandlers } from './handlers/room';
import { registerDevCardHandlers } from './handlers/devCards';
import { registerTurnHandlers } from './handlers/turn';
import { registerBuildHandlers } from './handlers/build';
import { registerSoldierHandlers } from './handlers/soldier';
import { registerBattleHandlers } from './handlers/battle';
import { registerTradeHandlers } from './handlers/trade';

/**
 * Wire up all socket handlers. Each domain module registers its own handlers on
 * the socket, keeping this entrypoint thin and the per-connection setup explicit.
 */
export function setupSocketHandlers(io: Server): void {
  io.on('connection', (socket) => {
    const ctx = { io, socket };
    registerRoomHandlers(ctx);
    registerDevCardHandlers(ctx);
    registerTurnHandlers(ctx);
    registerBuildHandlers(ctx);
    registerSoldierHandlers(ctx);
    registerBattleHandlers(ctx);
    registerTradeHandlers(ctx);
  });
}
