import mongoose from "mongoose";
import { Road } from "../types/Pieces";

export const roadSchema = new mongoose.Schema<Road>({
    start: {
        type: Object,
        required: true
    },
    end: {
        type: Object,
        required: true
    },
    owner: {
        type: String,
        required: true
    }
});
   