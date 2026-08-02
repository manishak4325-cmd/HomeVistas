import Neighborhood from '../models/Neighborhood.js';

// @desc    Fetch all neighborhoods
// @route   GET /api/neighborhoods
// @access  Public
export const getNeighborhoods = async (req, res) => {
  try {
    const { city } = req.query;
    const query = city ? { city: { $regex: new RegExp(city, 'i') } } : {};
    
    const neighborhoods = await Neighborhood.find(query);
    res.json(neighborhoods);
  } catch (error) {
    res.status(500);
    throw new Error('Server Error while fetching neighborhoods');
  }
};

// @desc    Fetch single neighborhood
// @route   GET /api/neighborhoods/:id
// @access  Public
export const getNeighborhoodById = async (req, res) => {
  try {
    const neighborhood = await Neighborhood.findById(req.params.id);

    if (neighborhood) {
      res.json(neighborhood);
    } else {
      res.status(404);
      throw new Error('Neighborhood not found');
    }
  } catch (error) {
    res.status(500);
    throw new Error('Server Error while fetching neighborhood');
  }
};
