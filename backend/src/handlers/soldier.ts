import {
  canMoveSoldierTo,
  canHealSoldierAt,
  subtractPrice,
  HealSoldierPrice,
  applyBonuses,
} from 'common';
import { gameRooms } from '../store';
import { HandlerContext } from './context';

/**
 * Soldier handlers: moving a garrisoned soldier and healing one.
 */
export function registerSoldierHandlers(ctx: HandlerContext): void {
  const { io, socket } = ctx;

  socket.on('moveSoldier', (data: { roomId: string; playerId: string; soldierId: string; targetVertexId: string }) => {
    const { roomId, playerId, soldierId, targetVertexId } = data;
    const room = gameRooms.get(roomId);
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }
    const board = room.board;
    if (!board) {
      socket.emit('error', { message: 'Game board is not available' });
      return;
    }
    const turnState = room.turnState;
    const currentPlayer = room.players.find((p) => p.id === playerId);
    if (!currentPlayer) {
      socket.emit('error', { message: 'Player not found' });
      return;
    }

    // Authoritative rules live in common (shared with the UI).
    const check = canMoveSoldierTo(board, turnState, currentPlayer.name, soldierId, targetVertexId);
    if (!check.allowed) {
      socket.emit('error', { message: check.reason ?? 'Cannot move soldier there' });
      return;
    }

    // Move the soldier to the new vertex.
    const soldier = board.soldiers[soldierId];
    if (soldier) {
      const originalVertexId = soldier.vertexId;
      soldier.vertexId = targetVertexId;

      // Record the move so it can be undone (returns the soldier to its
      // original vertex and refunds its action for this phase).
      turnState.undoLog.push({
        kind: 'moveSoldier',
        soldierId,
        originalVertexId,
      });
    }

    // Each soldier gets one action per Action phase (Rules.md line 30).
    turnState.soldiersActedThisTurn.push(soldierId);

    applyBonuses(room);
    io.to(roomId).emit('gameUpdate', { ...room });
  });

  socket.on('healSoldier', (data: { roomId: string; playerId: string; soldierId: string }) => {
    const { roomId, playerId, soldierId } = data;
    const room = gameRooms.get(roomId);
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }
    const board = room.board;
    if (!board) {
      socket.emit('error', { message: 'Game board is not available' });
      return;
    }
    const turnState = room.turnState;
    const currentPlayer = room.players.find((p) => p.id === playerId);
    if (!currentPlayer) {
      socket.emit('error', { message: 'Player not found' });
      return;
    }

    // Authoritative rules live in common (shared with the UI).
    const check = canHealSoldierAt(board, turnState, currentPlayer.name, soldierId, currentPlayer.resources);
    if (!check.allowed) {
      socket.emit('error', { message: check.reason ?? 'Cannot heal this soldier' });
      return;
    }

    // Deduct healing cost and restore the soldier (Rules.md line 27).
    currentPlayer.resources = subtractPrice(currentPlayer.resources, HealSoldierPrice);
    const soldier = board.soldiers[soldierId];
    if (soldier) {
      soldier.injured = false;
    }

    // Track this soldier so it cannot move this turn (Rules.md line 25).
    turnState.soldiersHealedThisTurn.push(soldierId);

    // Healing consumes the soldier's action for this phase.
    turnState.soldiersActedThisTurn.push(soldierId);

    applyBonuses(room);
    io.to(roomId).emit('gameUpdate', { ...room });
  });
}
