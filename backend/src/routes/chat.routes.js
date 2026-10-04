import express from 'express';

import { createResearch,getResearchById,getUsersAllResearch,addFeedbackToResearch} from '../controllers/research.controller';
import protect from '../middleware/auth.middleware';
const Chatrouter = express.Router();

Chatrouter.post('/chat',protect, createResearch);
Chatrouter.get('/chat',protect, getUsersAllResearch);
Chatrouter.get('/chat/:id',protect, getResearchById);
Chatrouter.post('/chat/feedback/:id',protect, addFeedbackToResearch);


export default Chatrouter;