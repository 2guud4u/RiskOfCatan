import mongoose from "mongoose";


export const devCardSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    used: {
        type: Boolean,
        required: true
    }
});
