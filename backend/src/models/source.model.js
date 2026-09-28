import mongoose from 'mongoose';

const sourceSchema = new mongoose.Schema(
    {
        message: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
            required: true,
            index: true,
        },

        title: {
            type: String,
            trim: true,
            maxlength: 300,
        },

        url: {
            type: String,
            required: true,
            trim: true,
        },

        snippet: {
            type: String,
            trim: true,
            maxlength: 2000,
        },

        content: {
            type: String,
            trim: true,
        },

        publishedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const Source = mongoose.model('Source', sourceSchema);

export default Source;