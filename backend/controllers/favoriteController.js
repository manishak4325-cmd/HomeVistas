import Favorite from '../models/Favorite.js';

// @desc    Add property to favorites
// @route   POST /api/favorites
// @access  Private
export const addFavorite = async (req, res) => {
  try {
    const { property } = req.body;

    const alreadyFavorite = await Favorite.findOne({ user: req.user._id, property });

    if (alreadyFavorite) {
      return res.status(400).json({ message: 'Property already in favorites' });
    }

    const favorite = await Favorite.create({
      user: req.user._id,
      property,
    });

    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's favorites
// @route   GET /api/favorites
// @access  Private
export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).populate('property');
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove property from favorites
// @route   DELETE /api/favorites/:id
// @access  Private
export const removeFavorite = async (req, res) => {
  try {
    // the ID here is the property ID or the favorite document ID.
    // Let's assume it's the property ID for easier frontend integration
    const favorite = await Favorite.findOne({ user: req.user._id, property: req.params.id });

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    await favorite.deleteOne();
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
