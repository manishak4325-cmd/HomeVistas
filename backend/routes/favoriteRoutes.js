import express from 'express';
import { addFavorite, getFavorites, removeFavorite } from '../controllers/favoriteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, addFavorite)
  .get(protect, getFavorites);

router.route('/:id')
  .delete(protect, removeFavorite);

export default router;
