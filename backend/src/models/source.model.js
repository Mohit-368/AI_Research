import mongoose from 'mongoose';

const sourceSchema = new mongoose.Schema(
    {
        // Sources are child documents of a Message; one research job can store many sources.
        message: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
            required: true,
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
            maxlength: 100000,
        },

        publishedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// The same URL is stored once per research job, while it may appear in different jobs.
sourceSchema.index({ message: 1, url: 1 }, { unique: true });

const Source = mongoose.model('Source', sourceSchema);

export default Source;