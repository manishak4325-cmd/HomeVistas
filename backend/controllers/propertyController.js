import Property from '../models/Property.js';
import Neighborhood from '../models/Neighborhood.js';

// @desc    Get all properties with optional filters
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req, res) => {
  try {
    const { keyword, minPrice, maxPrice, type, bedrooms, city, status, minNeighborhoodScore } = req.query;

    const query = {};

    // Only show approved properties to public by default
    query.status = status ? status : 'approved';

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { location: { $regex: keyword, $options: 'i' } },
        { city: { $regex: keyword, $options: 'i' } },
      ];
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (type) query.type = type;
    if (bedrooms) query.bedrooms = Number(bedrooms);
    if (city) query.city = { $regex: city, $options: 'i' };

    if (minNeighborhoodScore) {
      const minScore = Number(minNeighborhoodScore);
      const validNeighborhoods = await Neighborhood.find({ overallScore: { $gte: minScore } }).select('_id');
      const validIds = validNeighborhoods.map(n => n._id);
      query.neighborhood = { $in: validIds };
    }

    const page = Number(req.query.pageNumber) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    const count = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('owner', 'name email avatar')
      .populate('neighborhood')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({ properties, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get property by ID
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('neighborhood');

    if (property) {
      // Increment views
      property.views += 1;
      await property.save();
      res.json(property);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new property
// @route   POST /api/properties
// @access  Private (Agent/Admin)
export const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      type,
      bedrooms,
      bathrooms,
      area,
      location,
      city,
      images,
      amenities,
    } = req.body;

    const property = new Property({
      title,
      description,
      price,
      type,
      bedrooms,
      bathrooms,
      area,
      location,
      city,
      images,
      amenities,
      owner: req.user._id,
      status: req.user.role === 'Admin' ? 'approved' : 'pending',
    });

    const createdProperty = await property.save();
    res.status(201).json(createdProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private (Owner/Admin)
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check ownership
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }

    const {
      title,
      description,
      price,
      type,
      bedrooms,
      bathrooms,
      area,
      location,
      city,
      images,
      amenities,
      status, // Only Admin can change status directly if we restrict it below
    } = req.body;

    property.title = title || property.title;
    property.description = description || property.description;
    property.price = price || property.price;
    property.type = type || property.type;
    property.bedrooms = bedrooms || property.bedrooms;
    property.bathrooms = bathrooms || property.bathrooms;
    property.area = area || property.area;
    property.location = location || property.location;
    property.city = city || property.city;
    property.images = images || property.images;
    property.amenities = amenities || property.amenities;
    
    if (req.user.role === 'Admin' && status) {
      property.status = status;
    }

    const updatedProperty = await property.save();
    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private (Owner/Admin)
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    await property.deleteOne();
    res.json({ message: 'Property removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Match properties based on quiz preferences
// @route   POST /api/properties/match
// @access  Public
export const matchProperties = async (req, res) => {
  try {
    const { budget, type, bedrooms, cities, amenities, lifestyle, pets, wfh } = req.body;
    
    // Base filter: only approved properties
    const properties = await Property.find({ status: 'approved' }).populate('neighborhood');
    
    // Scoring logic for each property
    const scoredProperties = properties.map(property => {
      let score = 0;
      let totalWeight = 0;

      // Budget match (25%)
      if (budget && budget.min !== undefined && budget.max !== undefined) {
        totalWeight += 25;
        if (property.price >= budget.min && property.price <= budget.max) {
          score += 25;
        } else {
          // Partial score if close
          const diff = Math.min(Math.abs(property.price - budget.min), Math.abs(property.price - budget.max));
          const percentDiff = diff / ((budget.max + budget.min) / 2);
          if (percentDiff < 0.2) score += 10;
        }
      }

      // Property type (15%)
      if (type && type.length > 0) {
        totalWeight += 15;
        if (property.type.toLowerCase() === type.toLowerCase()) {
          score += 15;
        }
      }

      // Bedrooms (15%)
      if (bedrooms !== undefined && bedrooms !== null) {
        totalWeight += 15;
        const b = Number(bedrooms);
        if (property.bedrooms >= b) {
          score += 15;
        } else if (property.bedrooms === b - 1) {
          score += 5;
        }
      }

      // Amenities match (20%)
      if (amenities && amenities.length > 0) {
        totalWeight += 20;
        const matched = amenities.filter(a => 
          property.amenities.some(pa => pa.toLowerCase().includes(a.toLowerCase()))
        ).length;
        score += (matched / amenities.length) * 20;
      }

      // City match (15%)
      if (cities && cities.length > 0) {
        totalWeight += 15;
        if (cities.some(c => property.city.toLowerCase().includes(c.toLowerCase()))) {
          score += 15;
        }
      }
      
      // Lifestyle bonuses (10%)
      if (lifestyle) {
        totalWeight += 10;
        let bonus = 0;
        if (lifestyle === 'Family' && property.bedrooms >= 3) bonus += 5;
        if (lifestyle === 'Bachelor' && property.type.toLowerCase() === 'Apartment') bonus += 5;
        if (lifestyle === 'Investor' && property.price < 1000000) bonus += 5;
        
        // Use neighborhood scores for lifestyle if available
        if (property.neighborhood && property.neighborhood.scores) {
            if (lifestyle === 'Family' && property.neighborhood.scores.schools >= 8) bonus += 5;
            if (lifestyle === 'Bachelor' && property.neighborhood.scores.lifestyle >= 8) bonus += 5;
            if (lifestyle === 'Investor' && property.neighborhood.scores.futureDevelopment >= 8) bonus += 5;
        }
        score += Math.min(bonus, 10);
      }

      // WFH and Pets
      if (pets) {
         totalWeight += 5;
         if (property.amenities.some(a => a.toLowerCase().includes('pet'))) score += 5;
      }
      if (wfh) {
         totalWeight += 5;
         if (property.bedrooms > 1) score += 5; // simplified assumption: extra room for office
      }

      // Normalize score out of 100
      let matchScore = totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 0;

      const propObj = property.toObject();
      propObj.matchScore = matchScore;
      return propObj;
    });

    // Sort by match score descending
    scoredProperties.sort((a, b) => b.matchScore - a.matchScore);

    res.json(scoredProperties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

