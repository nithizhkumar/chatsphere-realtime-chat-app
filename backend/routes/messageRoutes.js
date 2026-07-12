import express from 'express';
import { createMessage, getConversation, markMessagesAsRead } from '../controllers/messageController.js';
import { validateMessageInput, validateMessageQuery } from '../validators/messageValidator.js';

const router = express.Router();

router.post('/', validateMessageInput, createMessage);
router.get('/', validateMessageQuery, getConversation);
router.patch('/read', markMessagesAsRead);

export default router;
