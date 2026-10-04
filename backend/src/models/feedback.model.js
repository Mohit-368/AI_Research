import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
    {
        message: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            required: true
        },

        feedback: {
            type: String,
            trim: true
        },

        rating: {
            type: Number,
            min: 1,
            max: 5
        }
    },
    {
        timestamps: true
    }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;