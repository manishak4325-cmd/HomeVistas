import express from 'express';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  matchProperties,
} from '../controllers/propertyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProperties)
  .post(protect, authorize('Agent', 'Admin'), createProperty);

router.post('/match', matchProperties);

router.route('/:id')
  .get(getPropertyById)
  .put(protect, authorize('Agent', 'Admin'), updateProperty)
  .delete(protect, authorize('Agent', 'Admin'), deleteProperty);

export default router;
