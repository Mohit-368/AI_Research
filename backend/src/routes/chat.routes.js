import express from 'express';
import {
  addFeedbackToResearch,
  createResearch,
  getResearchById,
  getUsersAllResearch,
} from '../controllers/research.controller.js';
import protect from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import rateLimit from '../middlewares/rate-limit.middleware.js';
import { feedbackSchema, researchSchema } from '../schemas/request.schemas.js';

const router = express.Router();
router.use(protect);
router.post('/chat', rateLimit({ windowMs: 60_000, max: 5 }), validate(researchSchema), createResearch);
router.get('/chat', getUsersAllResearch);
router.get('/chat/:id', getResearchById);
router.post('/chat/feedback/:id', validate(feedbackSchema), addFeedbackToResearch);
export default router;
