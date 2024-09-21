import mongoose from "mongoose";
import soldierSchema from "./Soldier";
import settlementSchema from "./Settlement";

const intersectionSchema = new mongoose.Schema({
    Settlement: {
        type: settlementSchema
    },
    Soldiers: {
        type: [soldierSchema]
    },
});

const Intersection = mongoose.model('Intersection', intersectionSchema);
export default Intersection;