import { Coords, Intersection, Tile } from './../../types/Board';
import { Settlement, isBuildType } from './../../types/Pieces';

import { buildType } from '../../types/Pieces';
import GameService from "../../Services/Game";
import {hasResources} from '../Utils';
import Soldier from '../../models/Soldier';
import { Resource } from '../../types/Board';
import Player from '../../types/player';
import { DevCardType } from '../../types/Pieces';
import { deserializeCoords, serializeCoords } from '../../utils/utils';
const costs = {
    "Settlement": new Map<Resource, number>([
        ["Brick", 1],
        ["Wood", 1],
        ["Sheep", 1],
        ["Wheat", 1]
    ]),
    "Road": new Map<Resource, number>([
        ["Brick", 1],
        ["Wood", 1]
    ]),
    "City": new Map<Resource, number>([
        ["Ore", 3],
        ["Wheat", 2]
    ]),
    "DevCard": new Map<Resource, number>([
        ["Ore", 1],
        ["Sheep", 1],
        ["Wheat", 1]
    ]),
    "Soldier": new Map<Resource, number>([
        ["Brick", 1],
        ["Sheep", 1],
        ["Wheat", 1]
    ])

};

export const handleBuildPhase = () => {

};

export const handleBuild = async (player: string, gameId: string, location: Coords[], type: buildType | "DevCard") : Promise<Boolean> => {
    let game = await GameService.getGame(gameId);
    let gameMap = game.board;
    let players = game.players;
    try{
        if(gameMap === undefined){
            throw new Error("No game map");
        }
        if(players === undefined){
            throw new Error("No players in game");
        }
        //get intersections
        
        let intersections = location.map((coord) => {return gameMap.get(serializeCoords(coord)) as Intersection});
        //check if intersection is valid
        if(intersections.some((intersection) => intersection === undefined)){
            
            throw new Error("Invalid intersections:" + intersections);
        }

      
        

        
        switch(type){
            case "Settlement":
                buildSettlement(player, intersections[0]);
                break;
            case "Road":
                buildRoad(player, intersections);
                break;
            case "City":
                upgradeCity(intersections[0]);
                break;
            case "DevCard":
                buildDevCard(player, players);
                break;
            case "Soldier":
                buildSoldier(player, intersections[0]);
                break;
    }} catch(e){
        console.log(e);
        return false;
    }

    console.log("updated map",gameMap);
    await GameService.updateGame(gameId, game);
    
    return true;
};

const handleBuy = async (playerName: string, gameId: string, buyType: buildType | "DevCard"): Promise<Boolean> => {
    const game = await GameService.getGame(gameId);
    //check if player has enough resources
    let players = game.players;
    if(players === undefined){
        throw new Error("No players in game");
        
    }

    let player = players.find((player) => player.name === playerName);

    let playerResources = player?.resources;

    if (playerResources === undefined) {
        throw new Error("No resources for player");
    }

    if(hasResources(costs[buyType], playerResources)){

    }

    return false;
};

const buildSettlement = ( playerName: string, intersection: Intersection): Intersection => {

    if(intersection.Settlement !== null){
        throw new Error("Intersection already occupied");
    }
    intersection.Settlement = {owner: playerName, upgraded: false};
    return intersection;
    
}

const buildRoad = (player: string, intersections: Intersection[]) => {
    
}

const upgradeCity = (intersection: Intersection): Intersection => {
    if(intersection.Settlement === null){
        throw new Error("No settlement at intersection");
    }
    intersection.Settlement.upgraded = true;
    return intersection;
}

const buildDevCard = (playerName: string, players: Player[]): Player[] => {
    let player = players.find((player) => player.name === playerName);
    if(player === undefined){
        throw new Error("Player not found");
    }
    let playerDevCards = player.devCards;
    let devCards: DevCardType[] = ["Knight", "VictoryPoint", "RoadBuilding", "YearOfPlenty", "Monopoly"];
    let randomIndex = Math.floor(Math.random() * devCards.length);
    let randomCard = devCards[randomIndex];
    playerDevCards.push({type: randomCard, used: false});
    player.devCards = playerDevCards;

    return players;
}

const buildSoldier = (playerName: string, intersection: Intersection): Intersection => {

    let soldier = {owner: playerName, injured: false};
    intersection.Soldiers.push(soldier);
    return intersection;
}