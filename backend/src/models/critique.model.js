import mongoose from 'mongoose';

const critiqueSchema = new mongoose.Schema(
    {
        message: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
            required: true,
            unique: true,
            index: true,
        },

        writer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Writer',
            required: true,
        },

        score: {
            type: Number,
            min: 0,
            max: 10,
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

        model: {
            type: String,
            trim: true,
        },

        provider: {
            type: String,
            trim: true,
        },

        processingTimeMs: {
            type: Number,
            min: 0,
        },

        tokenUsage: {
            input: {
                type: Number,
                min: 0,
            },

            output: {
                type: Number,
                min: 0,
            },

            total: {
                type: Number,
                min: 0,
            },
        },
    },
    {
        timestamps: true,
    }
);

const Critique = mongoose.model('Critique', critiqueSchema);

export default Critique;