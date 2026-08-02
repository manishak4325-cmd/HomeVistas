import express from 'express';
import {
  createReview,
  getPropertyReviews,
  getUserReviews,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createReview);

router.route('/user')
  .get(protect, getUserReviews);

router.route('/property/:propertyId')
  .get(getPropertyReviews);

router.route('/:id')
  .delete(protect, deleteReview);

export default router;
