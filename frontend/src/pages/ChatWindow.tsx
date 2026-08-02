import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import api from '../services/api';
import { ArrowLeft, Send, Home } from 'lucide-react';
import { format } from 'date-fns';

const ChatWindow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { socket, connect } = useChatStore();

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversation, setConversation] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Connect to socket when opening chat
    connect();

    return () => {
      // Disconnect when leaving page if we only want connection alive here. 
      // For global notifications, keep it alive in App.tsx instead.
      // We will keep it simple here.
    };
  }, [user, navigate, connect]);

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        // Fetch all convos to find the current one and get details
        const convRes = await api.get('/chat');
        const currentConv = convRes.data.find((c: any) => c._id === id);
        if (!currentConv) {
          navigate('/inbox');
          return;
        }
        setConversation(currentConv);

        // Fetch messages
        const msgRes = await api.get(`/chat/${id}/messages`);
        setMessages(msgRes.data);
      } catch (error) {
        console.error('Failed to load chat', error);
      }
    };

    if (id) fetchChatData();
  }, [id, navigate]);

  useEffect(() => {
    if (socket && id) {
      socket.emit('join_conversation', id);

      const handleReceiveMessage = (message: any) => {
        if (message.conversationId === id) {
          setMessages((prev) => [...prev, message]);
        }
      };

      socket.on('receive_message', handleReceiveMessage);

      return () => {
        socket.off('receive_message', handleReceiveMessage);
      };
    }
  }, [socket, id]);

  useEffect(() => {
    // Scroll to bottom on new messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    socket.emit('send_message', {
      conversationId: id,
      senderId: user?._id,
      content: newMessage,
    });

    setNewMessage('');
  };

  if (!conversation) return <div className="p-8 text-center animate-pulse">Loading chat...</div>;

  const otherUser = conversation.participants.find((p: any) => p._id !== user?._id);

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-4rem)] flex flex-col bg-card border-x border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background">
        <div className="flex items-center gap-4">
          <Link to="/inbox" className="p-2 hover:bg-accent rounded-full text-muted-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
              {otherUser?.avatar ? (
                <img src={otherUser.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                otherUser?.name?.charAt(0) || 'U'
              )}
            </div>
            <div>
              <h2 className="font-semibold">{otherUser?.name}</h2>
              <Link to={`/properties/${conversation.property._id}`} className="text-xs text-primary flex items-center gap-1 hover:underline">
                <Home className="h-3 w-3" />
                {conversation.property.title}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground pt-10">
            Start the conversation with {otherUser?.name}!
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender._id === user?._id;

            // Logic to group dates could be added here
            return (
              <div key={msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${isMe
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : 'bg-muted text-foreground rounded-tl-sm border border-border'
                  }`}>
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {format(new Date(msg.createdAt || Date.now()), 'HH:mm')}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-background">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-muted border border-border rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-primary text-primary-foreground p-3 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center h-12 w-12 shrink-0"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
