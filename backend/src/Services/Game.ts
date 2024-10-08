import {Coords, Tile, Intersection, TileImpl, Resource} from "../types/Board"
import {shuffleArray, flattenAndFillObject, rotate60degree, deserializeCoords, serializeCoords, getRotatedHexCoords} from "../utils/utils"
import Game from "../models/Game";
import Player from "../types/player";
import { Document, UpdateWriteOpResult } from 'mongoose';

let numTokens: { [key in string]: number } = {
    "2": 1,
    "3": 2,
    "4": 2,
    "5": 2,
    "6": 2,
    "8": 2,
    "9": 2,
    "10": 2,
    "11": 2,
    "12": 1
};

let resources: { [key in Resource]: number } = {
    "Wheat": 4,
    "Sheep": 4,
    "Ore": 3,
    "Desert": 1,
    "Brick": 3,
    "Wood": 4
};



export function createCoordsMapAndTokenMap(tileRadius: number): [Map<string, Tile | Intersection>, Map<string, string[]>] {
    let tokenList = shuffleArray(flattenAndFillObject(numTokens));
    let ResourceList = shuffleArray(flattenAndFillObject(resources));
    let tokenMap = new Map<string, string[]>();
    let CoordsMap = new Map<string, Tile | Intersection>();
    //create tiles according to tileRadius
    let coords = getHexagonCoords(tileRadius * 2 -1);

    //fill in intersections
    for (let i = 0; i < coords.length; i++){
        CoordsMap.set(serializeCoords(coords[i]), {Settlement: null, Soldiers: [], Port: null});
    }
    //get tile coords
    let tileCoordsSet = new Set(getTileCoords({x: 0, y: 0, z: 0}, tileRadius).map(coords => serializeCoords(coords)));
    let tileCoords = Array.from(tileCoordsSet).map(serialized => {
        return deserializeCoords(serialized);
      });
    //fill in tiles
    for(let i = 0; i < tileCoords.length; i++){
        let resource = ResourceList.pop();
        if (resource === "Desert"){
            CoordsMap.set(serializeCoords(tileCoords[i]), new TileImpl(resource, -1, true));

        }
        else{
            let token = tokenList.pop()
            if(token !== undefined){
                CoordsMap.set(serializeCoords(tileCoords[i]), new TileImpl((resource !== undefined ? resource : "Desert"), Number(token), false));
                
                    if(tokenMap.get(token) !== undefined){
                        tokenMap.get(token)?.push(serializeCoords(tileCoords[i]));
                    } else {
                        tokenMap.set(token, [serializeCoords(tileCoords[i])]);

                    }
            }
            
        }
            
    }

    return [CoordsMap, tokenMap];
}

function getTileCoords(root: Coords, hexRadius: number): Coords[]{
    let tileCoords = getRotatedHexCoords(root);
    
    if(hexRadius === 1){
        return tileCoords;
    }
    return tileCoords.concat(getTileCoords({x: root.x - 1, y:root.y-1, z:root.z+2}, hexRadius-1), getTileCoords({x: root.x  + 1, y:root.y-2, z:root.z+1}, hexRadius-1))
    
}
export function getHexagonCoords(radius: number): Coords[] {
    let coords = [];
    

    for (let x = -radius; x <= radius; x++) {
        for (let y = -radius; y <= radius; y++) {
            for (let z = -radius; z <= radius; z++) {
                if (x + y + z === 0) {
                    //get rid of vertex that are invalid
                    
                    coords.push({ x, y, z });
                }
            }
        }
    }

    let unwantedCoords = getCoordsForRemoval({x: 0, y: -radius, z: radius}, radius);
    coords = coords.filter(coord => !unwantedCoords.some(unwantedCoord => unwantedCoord.x === coord.x && unwantedCoord.y === coord.y && unwantedCoord.z === coord.z));
    
    
    
    return coords;
}

export function getCoordsForRemoval(root: Coords,radius: number) : Coords[]{
    let removalCoords = [];
    //get all directions

    for (let i = 0; i < 6; i++) {
        let rotated = rotate60degree(root);
        root = rotated;
        removalCoords.push(rotated);
    }
    
    if(radius === 3){
        return removalCoords;
    } 
    return removalCoords.concat(getCoordsForRemoval({x: root.x + 1, y:root.y, z:root.z-1}, radius-2), getCoordsForRemoval({x: root.x - 1, y:root.y+1, z:root.z}, radius-2))

  
}



////////////db interactions

 class GameService {
    async createGame(id: string) {
        const game = new Game({
            id: id,
            board: new Map(),
            players: [],
            roads: [],
            turnIndex: 0,
            tokenMap: new Map(),
            phase: "setup"


        });
        await game.save();
        return game;
    }

    async updateGame(gameId: string, game: Document<any, any>): Promise<UpdateWriteOpResult>  {
        let result = await Game.updateOne({ id: gameId }, game);
        return result;
    }

    async getGame(gameId: string){
        try{
            let game = await Game.findOne({ id: gameId });
            if(!game){
                console.log("creating game", gameId);
                game = await this.createGame(gameId);

            }
            return game;

        } catch (e){
            throw e;
        }
        
       
        
    }

    async addPlayer(gameId: string, player: Player) {
        let game = await this.getGame(gameId);
        game.players.push(player);
        await game.save();
        return game;
    }

    
}
export default new GameService();