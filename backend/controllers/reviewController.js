import Review from '../models/Review.js';
import Property from '../models/Property.js';

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { rating, title, comment, propertyId } = req.body;

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      property: propertyId,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Property already reviewed by this user' });
    }

    const review = await Review.create({
      rating: Number(rating),
      title,
      comment,
      property: propertyId,
      user: req.user._id,
    });

    // Update Property average rating and numReviews
    const allReviews = await Review.find({ property: propertyId });
    property.numReviews = allReviews.length;
    property.rating = allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;
    
    await property.save();

    res.status(201).json(review);
  } catch (error) {
    if (error.code === 11000) {
       return res.status(400).json({ message: 'Property already reviewed by this user' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get property reviews
// @route   GET /api/reviews/property/:propertyId
// @access  Public
export const getPropertyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
      
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user reviews
// @route   GET /api/reviews/user
// @access  Private
export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('property', 'title images')
      .sort({ createdAt: -1 });
      
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Only review owner or Admin can delete
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    const propertyId = review.property;
    await review.deleteOne();

    // Update Property average rating and numReviews
    const property = await Property.findById(propertyId);
    if (property) {
      const allReviews = await Review.find({ property: propertyId });
      property.numReviews = allReviews.length;
      property.rating = allReviews.length > 0 
        ? allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length 
        : 0;
      await property.save();
    }

    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
