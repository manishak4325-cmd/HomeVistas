import Inquiry from '../models/Inquiry.js';
import Property from '../models/Property.js';

// @desc    Create a new inquiry
// @route   POST /api/inquiries
// @access  Public
export const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, message, property } = req.body;

    const propertyExists = await Property.findById(property);
    if (!propertyExists) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const inquiry = new Inquiry({
      name,
      email,
      phone,
      message,
      property,
      user: req.user ? req.user._id : undefined,
    });

    const createdInquiry = await inquiry.save();
    res.status(201).json(createdInquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get inquiries for a property (Owner/Admin) or user
// @route   GET /api/inquiries
// @access  Private
export const getInquiries = async (req, res) => {
  try {
    if (req.user.role === 'Admin') {
      const inquiries = await Inquiry.find().populate('property', 'title').populate('user', 'name email');
      return res.json(inquiries);
    } 
    
    if (req.user.role === 'Agent') {
      // Find properties owned by agent
      const properties = await Property.find({ owner: req.user._id });
      const propertyIds = properties.map((p) => p._id);
      
      const inquiries = await Inquiry.find({ property: { $in: propertyIds } })
        .populate('property', 'title')
        .populate('user', 'name email');
      return res.json(inquiries);
    }

    // Regular user sees their own inquiries
    const inquiries = await Inquiry.find({ user: req.user._id }).populate('property', 'title');
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
