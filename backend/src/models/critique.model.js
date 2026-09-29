import mongoose from 'mongoose';

const critiqueSchema = new mongoose.Schema(
    {
        // One Critique document stores the quality review for one completed Message/report.
        message: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
            required: true,
            unique: true,
        },

        score: {
            type: Number,
            required: true,
            min: 0,
            max: 10,
            validate: {
                validator: Number.isInteger,
                message: 'Score must be a whole number',
            },
        },

        strengths: {
            type: [String],
            default: [],
        },

        weaknesses: {
            type: [String],
            default: [],
        },

        missingInformation: {
            type: [String],
            default: [],
        },

        suggestions: {
            type: [String],
            default: [],
        },

        feedback: {
            type: String,
            trim: true,
        },


    },
    {
        timestamps: true,
    }
);

const Critique = mongoose.model('Critique', critiqueSchema);

export default Critique;