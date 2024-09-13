
import { createPlayer } from "../Services/Player";
import GameService from "../Services/Game";
import {createCoordsMapAndTokenMap} from "../Services/Game";
import { Tile, Intersection } from "../types/Board";

export async function addPlayer(gameId: string, name: string, color: string) {

    let game = await GameService.getGame(gameId);
    let player = createPlayer(name, color);
    game.players.push(player);
    await GameService.updateGame(gameId, game);
    return game;
}

export async function removePlayer(gameId: string, playerId: string) {
    let game = await GameService.getGame(gameId);
    game.players = game.players.filter((player) => player.name !== playerId);
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

export async function generateBoardAndSave(gameId: string, radius: number): Promise<Map<string, Tile | Intersection> | null> {
    try {
        // Retrieve the current game data
        let game = await GameService.getGame(gameId);
        
        // Create the board and token map
        const [coordsMap, tokenMap] = createCoordsMapAndTokenMap(radius);
        game.board = coordsMap;
        game.tokenMap = tokenMap;
        game.phase = "setup";
        
        // Update the game data
        const res = await GameService.updateGame(gameId, game);
        
        // Check if the update was successful
        if (res.modifiedCount === 1) {
            return game.board;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error updating game:", error);
        return null;
    }
}





