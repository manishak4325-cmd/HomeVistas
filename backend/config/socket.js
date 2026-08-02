import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

export const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`User joined conversation: ${conversationId}`);
    });

    // Handle sending a message
    socket.on('send_message', async (data) => {
      const { conversationId, senderId, content } = data;
      
      try {
        // Save message to database
        const message = await Message.create({
          conversationId,
          sender: senderId,
          content,
          readBy: [senderId],
        });

        // Populate sender info before broadcasting
        await message.populate('sender', 'name avatar');

        // Update conversation's lastMessage
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: message._id,
        });

        // Broadcast to everyone in the room (including sender to confirm delivery)
        io.to(conversationId).emit('receive_message', message);
        
      } catch (error) {
        console.error('Error saving message via socket:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
