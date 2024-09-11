import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
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
        type: [mongoose.Schema.Types.Mixed]
    },
    roads: {
        type: [mongoose.Schema.Types.Mixed]
    },
    turnIndex: {
        type: Number
    },



});

const Game = mongoose.model('Game', gameSchema);

export default Game;