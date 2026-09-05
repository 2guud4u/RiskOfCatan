/**
 * UI-only shared types (not part of the backend wire contract).
 *
 * Domain entities (GameRoom, Player, Board, ...) live in `common/types/*` and
 * are imported from there — only client-side shapes belong here.
 */

/** A board object selected in the sidebar (vertex or edge panel). */
export interface SelectableObject {
  type: 'vertex' | 'edge';
  id: string;
}

/** Persisted lobby join, so a reload auto-rejoins the same room. */
export interface SavedSession {
  roomId: string;
  playerName: string;
  color?: string;
}

/** Persisted DraggablePanel position/size, so the layout survives a reload. */
export interface SavedPanelLayout {
  pos: { x: number; y: number } | null;
  size: { w: number; h: number } | null;
}

/** A panel's home rect: origin + optional width/height (natural size when omitted). */
export interface DefaultRect {
  x: number;
  y: number;
  /** Omit to keep the panel's natural width. */
  w?: number;
  /** Omit to keep the panel's natural height. */
  h?: number;
}
