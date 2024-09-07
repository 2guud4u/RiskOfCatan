import Game from "../models/game";
import { Player } from "../types/player";
import { createPlayer } from "../Services/Player";


export async function addPlayer(gameId: string, name: string, color: string) {

    let game = await getGame(gameId);
    let player = createPlayer(name, color);
    game.players.push(player);
    await game.save();
    return game;
}

export async function getGame(gameId: string) {
    const game = await Game.findOne({ id: gameId });
    if (!game) {
        throw new Error("Game not found");
    }
    return game;
}