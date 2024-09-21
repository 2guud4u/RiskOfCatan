import Player from "../types/player";
import { Intersection, Resource, Tile } from "../types/Board";

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

export const hasResources = (requiredResources: Map<Resource, number>, playerResources: Map<Resource, number>): boolean => {
    for(let [resource, amount] of requiredResources){
        let playerAmount = playerResources.get(resource);
        playerAmount = playerAmount ? playerAmount : 0;
        if(playerAmount < amount){
            return false;
        }
    }
    return true;
}