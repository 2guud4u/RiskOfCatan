import mongoose from "mongoose";
import { Document } from 'mongoose';
import { Game } from "../types/Board";
import { playerSchema } from "./Player";
import { roadSchema } from "./Road";


const gameSchema = new mongoose.Schema<Game & Document>({
    id: {
        type: String,
        required: true,
        unique: true
    },
    board: {
        type: Map,
        of: { type: mongoose.Schema.Types.Mixed }
    },
    players: {
        type: [playerSchema]
    },
    roads: {
        type: [roadSchema]
    },
    turnIndex: {
        type: Number
    },
    phase: {
        type: String
    },
    tokenMap: {
        type: Map,
        of: { type: mongoose.Schema.Types.Mixed }
    },



});

const Game = mongoose.model('Game', gameSchema);

export default Game;