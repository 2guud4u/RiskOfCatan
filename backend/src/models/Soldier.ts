import mongoose from "mongoose";

const soldierSchema = new mongoose.Schema({
    owner: {
        type: String,
    },
    injured: {
        type: Boolean,
    }
});

const Soldier = mongoose.model("Soldier", soldierSchema)

export default Soldier