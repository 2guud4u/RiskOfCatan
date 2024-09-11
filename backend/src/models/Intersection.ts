import mongoose from "mongoose";

const intersectionSchema = new mongoose.Schema({
    Settlement: {
        type: mongoose.Schema.Types.Mixed
    },
    Soldiers: {
        type: [mongoose.Schema.Types.Mixed]
    },
});

const Intersection = mongoose.model('Intersection', intersectionSchema);
export default Intersection;