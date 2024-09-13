
import { createPlayer } from "../Services/Player";
import GameService from "../Services/Game";
import {createCoordsMapAndTokenMap} from "../Services/Game";

export async function addPlayer(gameId: string, name: string, color: string) {

    let game = await GameService.getGame(gameId);
    let player = createPlayer(name, color);
    game.players.push(player);
    await GameService.updateGame(gameId, game);
    return game;
}

export async function removePlayer(gameId: string, playerId: string) {
    let game = await GameService.getGame(gameId);
    game.players = game.players.filter((player) => player.id !== playerId);
    await GameService.updateGame(gameId, game);
    return game;
}

export async function getPlayers(gameId: string) {
    try{
        let game = await GameService.getGame(gameId);
        return game.players;

    } catch (error) {
        console.log(error);
        return [];
    }
    
}

export async function startGame(gameId: string) {
    let game = await GameService.getGame(gameId);
    
    await GameService.updateGame(gameId, game);
    return game;
}

export async function generateBoard(gameId: string, radius: number) {
    let game = await GameService.getGame(gameId);
    const [coordsMap, tokenMap] = createCoordsMapAndTokenMap(radius);
    game.board = coordsMap;
    game.tokenMap = tokenMap;
    game.phase = "setup";
    await GameService.updateGame(gameId, game);
    return game;
}




