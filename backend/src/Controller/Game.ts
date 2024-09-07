
import { createPlayer } from "../Services/Player";
import GameService from "../Services/Game";

export async function addPlayer(gameId: string, name: string, color: string) {

    let game = await GameService.getGame(gameId);
    let player = createPlayer(name, color);
    game.players.push(player);
    await GameService.updateGame(gameId, game);
    return game;
}

