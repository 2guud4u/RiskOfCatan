import { Coords, Intersection, Tile } from './../../types/Board';
import { Settlement } from './../../types/Pieces';

import { buildType } from '../../types/Pieces';
import GameService from "../../Services/Game";
import {hasResources} from '../Utils';
import Soldier from '../../models/Soldier';
import { Resource } from '../../types/Board';
import Player from '../../types/player';
import { DevCardType } from '../../types/Pieces';
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

const handleBuild = (player: string, gameId: string, location: Coords[], building: buildType) => {
    
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

const buildSettlement = (coordinate: string, playerName: string, map: Map<string, Tile | Intersection>): Map<string, Tile | Intersection> => {
    let Intersection = map.get(coordinate) as Intersection;
    if(Intersection === undefined){
        throw new Error("No intersection at coordinate");
    }
    if(Intersection.Settlement !== null){
        throw new Error("Intersection already occupied");
    }
    Intersection.Settlement = {owner: playerName, upgraded: false};
    map.set(coordinate, Intersection);

    return map;
    
}

const buildRoad = () => {
    
}

const upgradeCity = () => {
        
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

const buildSoldier = (coordinate: string, playerName: string, map: Map<string, Tile | Intersection>): Map<string, Tile | Intersection> => {
    let Intersection = map.get(coordinate) as Intersection;
    if(Intersection === undefined){
        throw new Error("No intersection at coordinate");
    }
    let soldier = {owner: playerName, injured: false};
    Intersection.Soldiers.push(soldier);
    map.set(coordinate, Intersection);

    return map;
}