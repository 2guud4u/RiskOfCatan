import mongoose from "mongoose";

const tileSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    rollNumber: {
        type: Number
    },
    robber:{
        type: Boolean
    }
});

const Tile = mongoose.model('Tile', tileSchema);

export default Tile;