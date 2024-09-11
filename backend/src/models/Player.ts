import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    resources: {
        type: Map,
        of: { type: Number },
        required: true
    },
    devCards: {
        type: [mongoose.Schema.Types.Mixed],
        required: true
    }
});

const Player = mongoose.model('Player', playerSchema);
export default Player;