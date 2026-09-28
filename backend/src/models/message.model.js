import mongoose from 'mongoose';

const sourceSchema = new mongoose.Schema(
    {
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

        
    },
    { _id: true }
);

const critiqueSchema = new mongoose.Schema(
    {
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
    },
    { _id: false }
);

const researchSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        topic: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
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
            index: true,
        },

        sources: {
            type: [sourceSchema],
            default: [],
        },

        writerOutput: {
            type: String,
            trim: true,
        },

        critique: {
            type: critiqueSchema,
        },

        finalReport: {
            type: String,
            trim: true,
        },

        error: {
            type: String,
            trim: true,
        },

        completedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

researchSchema.index({ user: 1, createdAt: -1 });

const ResearchReport = mongoose.model('ResearchReport', researchSchema);

export default ResearchReport;










// {
//     user: ObjectId("..."),

//     topic: "Impact of AI agents on software engineering",

//     status: "completed",

//     sources: [
//         {
//             title: "Article title",
//             url: "https://example.com/article",
//             snippet: "Short search result...",
//             content: "Scraped article content...",
//             publishedAt: "2026-09-20"
//         }
//     ],

//     writerOutput: "# Impact of AI Agents\n\n...",

//     critique: {
//         score: 8.5,
//         strengths: [
//             "Good source coverage",
//             "Clear structure"
//         ],
//         weaknesses: [
//             "Limited discussion of security"
//         ],
//         missingInformation: [
//             "Enterprise deployment data"
//         ],
//         suggestions: [
//             "Add recent industry statistics"
//         ],
//         feedback: "The report is well structured..."
//     },

//     finalReport: "# Final Research Report\n\n...",

//     createdAt: "...",
//     updatedAt: "...",
//     completedAt: "..."
// }
