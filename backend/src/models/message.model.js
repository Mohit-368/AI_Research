import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        // A Message is one research request/job. Sources, report, and critique reference this _id.
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        prompt: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },

        status: {
            type: String,
            enum: [
                'pending',
                'searching',
                'scraping',
                'writing',
                'critiquing',
                'completed',
                'failed',
            ],
            default: 'pending',
        },

        error: {
            type: String,
            trim: true,
            maxlength: 2000,
        },
    },
    {
        timestamps: true,
    }
);

// User history is queried newest-first without duplicating the user's name on every job.
messageSchema.index({ user: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;