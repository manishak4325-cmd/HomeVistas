import express from 'express';
import { createInquiry, getInquiries } from '../controllers/inquiryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// protect middleware is optional for creating inquiry if we allow guests
// but for this route, let's conditionally handle user in controller instead of require auth
router.post('/', createInquiry);
router.get('/', protect, getInquiries);

export default router;
