import React, { useEffect, useMemo, useState } from 'react';
import { useGameRoom } from '../contexts/GameContext';
import BoardView from './BoardView';
import Sidebar from './SideBar/Index';
import RobberPrompt from './RobberPrompt';
import StealPrompt from './StealPrompt';
import DevCardPrompt from './DevCardPrompt';
import ResourceGainLayer from '../components/ResourceGainLayer';
import BattleModal from './BattleModal';
import DraggablePanel from '../components/DraggablePanel';
import { resetAllPanels } from '../components/DraggablePanel';
import { GAME_HEX_SIZE } from 'common';
import { DefaultRect } from '../types';
import { SIDEBAR_W } from '../constants';

/**
 * The game screen. Everything is floating: the board panel filling the
 * left area edge-to-edge, and the sidebar in its own column (with tabs
 * for board, turn, players, cards, trade, and battle). The board and
 * sidebar are positioned from the viewport, so they track window resizes.
 * Dragging a panel moves only that panel — the others never reflow.
 */
const Game: React.FC = () => {
  const { gameRoom, currentPlayer } = useGameRoom();
  const [vp, setVp] = useState({ vw: window.innerWidth, vh: window.innerHeight });

  useEffect(() => {
    const onResize = () => setVp({ vw: window.innerWidth, vh: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const layouts = useMemo(() => {
    const { vw, vh } = vp;
    const out: Record<string, DefaultRect | null> = {};
    // Board: fills the left area edge-to-edge (the board SVG scales to fit).
    out.board = { x: 0, y: 0, w: Math.max(200, vw - SIDEBAR_W), h: vh };
    // Sidebar: its own column, full height.
    out.sidebar = { x: vw - SIDEBAR_W, y: 0, w: SIDEBAR_W, h: vh };
    return out;
  }, [vp]);
  if (!gameRoom || !currentPlayer) {
    return <p className="text-center text-gray-500">Loading game...</p>;
  }

  return (
    <div className="min-h-screen">

      <RobberPrompt />
      <button
        type="button"
        onClick={resetAllPanels}
        className="fixed top-3 right-3 z-40 px-3 py-1.5 text-[12px] font-semibold rounded-md border border-gray-300 bg-white shadow cursor-pointer hover:bg-gray-100"
        title="Restore every panel to its default position"
      >
        {'⟲'} Reset displays
      </button>

      <DraggablePanel
        id="board"
        className="bg-white rounded-lg shadow"
        layout={layouts.board}
      >
        <BoardView hexSize={GAME_HEX_SIZE} />
      </DraggablePanel>

      <Sidebar layout={layouts.sidebar} />

      {/* Steal prompt: the thief picks a face-down card from a victim. */}
      <StealPrompt />

      {/* Development card choice: Year of Plenty / Monopoly. */}
      <DevCardPrompt />

      {/* Resource gain animation: cards fly from the source to the panel. */}
      <ResourceGainLayer />

      {/* Separate battle window that opens for all players while combat is active. */}
      <BattleModal />
    </div>
  );
};

export default Game;
