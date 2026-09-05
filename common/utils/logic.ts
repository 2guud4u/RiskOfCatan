import { Price, ResourceCount } from '../types/Logic';

/**
 * The affordability check (pure code). The price constants live in `Constant.ts`;
 * the `ResourceCount` / `Price` types live in `types/Logic.ts`.
 */

/** Whether a player's resources can cover the (positive) price. */
export function canAfford(resources: ResourceCount, price: Price): boolean {
  return (Object.keys(price) as (keyof Price)[]).every((k) => resources[k] >= price[k]);
}
