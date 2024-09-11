import { Road, Settlement, Soldier } from "./Pieces";
import { Player } from "./player";

export enum Resource {
    Brick= "Brick",
    Wood= "Wood",
    Wheat= "Wheat",
    Sheep= "Sheep",
    Ore= "Ore",
    Desert= "Desert"
  }

export interface Tile {
   Resource: Resource;
   RollNumber: number;
   Robber: boolean;
}

export class TileImpl implements Tile {
    Resource: Resource;
    RollNumber: number;
    Robber: boolean;
    constructor(Resource: Resource, RollNumber: number, Robber: boolean){
        this.Resource = Resource;
        this.RollNumber = RollNumber;
        this.Robber = Robber;
    }
}

export interface Intersection{
    Settlement: Settlement | null;
    Soldiers: Soldier[];
    Port: Map<Resource, number> | null;
}

export class IntersectionImpl implements Intersection {
    Settlement: Settlement;
    Soldiers: Soldier[];
    Port: Map<Resource, number> | null;
    constructor(Settlement: Settlement, Soldiers: Soldier[], Port: Map<Resource, number> | null){
        this.Settlement = Settlement;
        this.Soldiers = Soldiers;
        this.Port = Port;
    }
}

export interface Coords {
    x: number;
    y: number;
    z: number;
}


export interface Game {
    board: Map<Coords, Tile | Intersection>;
    players: Player[];
    roads: Road[];
    turnIndex: number;

}

export class GameImpl implements Game {
    board: Map<Coords, Tile | Intersection>;
    players: Player[];
    roads: Road[];
    turnIndex: number;

    constructor(board: Map<Coords, Tile | Intersection>){
        this.board = board;
        this.players = [];
        this.roads = [];
        this.turnIndex = 0;

    }

    lookupCoords(coords: Coords): Tile | Intersection | undefined {
        return this.board.get(coords);
    }

    updateCoords(coords: Coords, value: Tile | Intersection): void {
        this.board.set(coords, value);
    }
    addPlayer(player: Player): void {
        this.players.push(player);
    }

}






