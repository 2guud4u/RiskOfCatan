

import GameService from "../Services/Game";
import {rotate60degree, deserializeCoords, serializeCoords, getRotatedHexCoords} from "../utils/utils";


import { Intersection, Resource, Tile } from "../types/Board";
import Player from "../types/player";

export const handleDiceRollPhase = async (gameId: string, diceRoll: string): Promise<void> => {

    let game = await GameService.getGame(gameId);
    let tokenMap = game.tokenMap;
    let board = game.board;
    let players = game.players;
    
    if(diceRoll === "7"){
        return
    }

    let rolledTiles = getRolledTiles(board, tokenMap, diceRoll);
    for(let tileObj of rolledTiles){
        let intersectionCoords = getHexIntersections(tileObj.coord);
        for(let intersectionCoord of intersectionCoords){
            let intersection = board.get(intersectionCoord) as Intersection;
            let settlement = intersection.Settlement;
            //check if intersection has a settlement
            if(settlement !== null){
               //get owner
               let owner = settlement.owner;
               // calc resource
               let resource = tileObj.tile.Resource;
               let resourceAmount = settlement.upgraded ? 2 : 1;
                //give resource to player
                updatePlayerResources(owner, resource, resourceAmount, players);
            }

        }
    }


}



export const getRolledTiles = (board: Map<string, Tile | Intersection>, tokenMap: Map<string, string[]>, diceRoll: string):  {tile: Tile, coord: string}[] => {

   

    let tilesCoords = tokenMap.get(diceRoll);
    if(tilesCoords === undefined){
        return [];
    } else{
        let tiles =  tilesCoords.map((tileCoord) => {
            let tile = board.get(tileCoord) as Tile;
            return {tile: tile, coord: tileCoord};
        });
        return tiles;

    }
    

}

export const getHexIntersections = (tileCoordStr:  string): string[] => {
    let tileCoord = deserializeCoords(tileCoordStr);
    let coords = getRotatedHexCoords({x: tileCoord.x, y: tileCoord.y-1, z: tileCoord.z+1});
    let intersections = coords.map((coord) => {
        return serializeCoords(coord);
        
    });
    return intersections;
}

export const updatePlayerResources = (playerName: string, resource: Resource, amount: number, playerList: Player[]): Player[] => {
    //get player
    let player = playerList.find((player) => player.name === playerName);
    if(player !== undefined){
        //update resources
        let playerResources = player.resources;
        let currentResourceAmount = playerResources.get(resource)
        currentResourceAmount =  currentResourceAmount ? currentResourceAmount : 0;

        playerResources.set(resource, currentResourceAmount + amount) ;
    }
    return playerList;
}






