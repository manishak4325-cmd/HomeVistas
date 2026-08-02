import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Property from '../models/Property.js';

// @desc    Get all conversations for a user
// @route   GET /api/chat
// @access  Private
export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: { $in: [req.user._id] },
    })
      .populate('participants', 'name email avatar')
      .populate('property', 'title images')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or Get a conversation for a property with owner
// @route   POST /api/chat/property/:propertyId
// @access  Private
export const getOrCreateConversation = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const ownerId = property.owner;
    const buyerId = req.user._id;

    if (ownerId.toString() === buyerId.toString()) {
      return res.status(400).json({ message: 'You cannot chat with yourself' });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      property: propertyId,
      participants: { $all: [buyerId, ownerId] },
    }).populate('participants', 'name email avatar').populate('property', 'title images');

    if (!conversation) {
      // Create new conversation
      conversation = await Conversation.create({
        property: propertyId,
        participants: [buyerId, ownerId],
      });
      // populate it before returning
      conversation = await Conversation.findById(conversation._id)
        .populate('participants', 'name email avatar')
        .populate('property', 'title images');
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/chat/:conversationId/messages
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Verify user is part of conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to view these messages' });
    }

    const messages = await Message.find({ conversationId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
