import express from 'express';
import {
  getConversations,
  getOrCreateConversation,
  getMessages,
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All chat routes require authentication

router.route('/')
  .get(getConversations);

router.route('/property/:propertyId')
  .post(getOrCreateConversation);

router.route('/:conversationId/messages')
  .get(getMessages);

export default router;
