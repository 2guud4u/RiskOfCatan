import { Board, HexId } from '../types/Board';
import { Player } from '../types/Player';
import { ResourceKey, BuildCheck } from '../types/Logic';
import { RESOURCES } from '../Constant';

/**
 * Authoritative robber-placement checks, shared by the UI (highlighting) and
 * the backend (the `moveRobber` handler).
 */

/**
 * Whether a hex is a valid robber target: it must exist, not be the desert
 * (the robber cannot sit on it), and not be the hex the robber already
 * occupies (placing it in place is a no-op).
 */
export function canPlaceRobberOn(board: Board, hexId: HexId): BuildCheck {
  const hex = board.hexes[hexId];
  if (!hex) return { allowed: false, reason: 'Unknown hex' };
  if (hex.terrain === 'Desert') return { allowed: false, reason: 'The robber cannot be placed on the desert' };
  if (hex.robber) return { allowed: false, reason: 'The robber is already on this hex' };
  return { allowed: true, reason: null };
}

/** Move the robber onto the given hex (caller validates first). */
export function placeRobber(board: Board, hexId: HexId): void {
  for (const h of Object.values(board.hexes)) h.robber = false;
  board.hexes[hexId].robber = true;
}

/**
 * Names of players (optionally excluding one) with a settlement or a city on
 * a vertex of the given hex. Roads do not count for steal eligibility
 * (standard Catan rule).
 */
export function playersAdjacentToHex(board: Board, hexId: HexId, excludeName?: string): string[] {
  const names = new Set<string>();
  for (const vertex of Object.values(board.vertices)) {
    if (!vertex.hexIds.includes(hexId)) continue;
    if (vertex.settlementId) {
      const settlement = board.settlements[vertex.settlementId];
      if (settlement && settlement.ownerId !== excludeName) names.add(settlement.ownerId);
    }
  }
  return Array.from(names);
}

/**
 * Expand a resource count into the individual cards it represents, in
 * `RESOURCES` (e.g. { Wood: 2, Brick: 1 } -> [Wood, Wood, Brick]).
 */
export function expandCards(resources: Record<ResourceKey, number>): ResourceKey[] {
  const cards: ResourceKey[] = [];
  for (const resource of RESOURCES) {
    const count = resources[resource] ?? 0;
    for (let i = 0; i < count; i++) cards.push(resource);
  }
  return cards;
}

/**
 * Names among `victimNames` that hold at least one resource card (the
 * eligible steal victims).
 */
export function eligibleVictims(players: Player[], victimNames: string[]): string[] {
  return players
    .filter((p) => victimNames.includes(p.name) && Object.values(p.resources).some((n) => n > 0))
    .map((p) => p.name);
}

/**
 * Take the card at `cardIndex` (see `expandCards`) from `victim` and give it
 * to `thief`. Returns the stolen resource type, or null when the index is out
 * of range.
 */
export function stealCard(thief: Player, victim: Player, cardIndex: number): ResourceKey | null {
  const cards = expandCards(victim.resources);
  if (cardIndex < 0 || cardIndex >= cards.length) return null;
  const resource = cards[cardIndex];
  victim.resources[resource] -= 1;
  thief.resources[resource] += 1;
  return resource;
}
