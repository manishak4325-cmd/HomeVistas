import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import { MessageSquare, Home } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Inbox = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { conversations, fetchConversations } = useChatStore();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchConversations();
  }, [user, navigate, fetchConversations]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <MessageSquare className="h-8 w-8 text-primary" />
        Messages
      </h1>

      {conversations.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No conversations yet</h2>
          <p className="text-muted-foreground">When you contact an owner or receive inquiries, they will appear here.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
          {conversations.map((conv) => {
            const otherUser = conv.participants.find((p: any) => p._id !== user?._id);
            
            return (
              <Link 
                key={conv._id} 
                to={`/chat/${conv._id}`}
                className="block hover:bg-accent transition-colors p-4 sm:p-6"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                      {otherUser?.avatar ? (
                        <img src={otherUser.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        otherUser?.name?.charAt(0) || 'U'
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{otherUser?.name || 'Unknown User'}</h3>
                      <p className="text-sm text-primary flex items-center gap-1 mb-1 font-medium">
                        <Home className="h-3 w-3" />
                        {conv.property?.title}
                      </p>
                      <p className="text-muted-foreground text-sm line-clamp-1">
                        {conv.lastMessage?.content || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {conv.lastMessage 
                      ? formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: true })
                      : formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true })
                    }
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Inbox;
