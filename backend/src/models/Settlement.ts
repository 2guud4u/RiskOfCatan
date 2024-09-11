import mongoose from "mongoose";

const settlementSchema = new mongoose.Schema({
    
    owner: {
        type: String,
    },
    upgraded: {
        type: Boolean,
    },
});

const Settlement = mongoose.model('Settlement', settlementSchema);

export default Settlement;