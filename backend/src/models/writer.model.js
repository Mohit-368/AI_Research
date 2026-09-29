import mongoose from 'mongoose';

const writerSchema = new mongoose.Schema(
    {
        // One Writer document stores the final Markdown report generated for one Message.
        message: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
            required: true,
            unique: true,
        },

        output: {
            type: String,
            required: true,
            maxlength: 200000,
        },

    },
    {
        timestamps: true,
    }
);

const Writer = mongoose.model('Writer', writerSchema);

export default Writer;