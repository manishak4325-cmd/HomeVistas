import express from 'express';
import { getNeighborhoods, getNeighborhoodById } from '../controllers/neighborhoodController.js';

const router = express.Router();

router.route('/').get(getNeighborhoods);
router.route('/:id').get(getNeighborhoodById);

export default router;
