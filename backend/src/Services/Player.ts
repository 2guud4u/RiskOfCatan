import { Player } from "../types/player";

export function createPlayer(name: string, color: string): Player {
    return {
        name,
        color,
        resources: new Map(),
        devCards: []
    };
}
