import mongoose from "mongoose";

// Check if the model is already registered
const Board = mongoose.models.Board || mongoose.model("Board", new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    name: {
        type: String,
        required: true,
        trim: true
    }
}));

export default Board;