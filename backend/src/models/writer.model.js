import mongoose from 'mongoose';

const writerSchema = new mongoose.Schema(
    {
        message: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
            required: true,
            unique: true,
            index: true,
        },

        output: {
            type: String,
            required: true,
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

const Writer = mongoose.model('Writer', writerSchema);

export default Writer;