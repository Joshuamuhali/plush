import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare, 
  Send, 
  Search, 
  User, 
  Clock, 
  CheckCircle, 
  ArrowLeft,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  read_at: string | null;
  sender_name: string;
  receiver_name: string;
  property_title?: string;
}

export default function Messages() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock data - replace with real API call
  const mockMessages: Message[] = [
    {
      id: '1',
      sender_id: 'user1',
      receiver_id: user?.id || '',
      message: 'Hi, I\'m interested in the Modern Villa property. Is it still available?',
      created_at: '2024-03-24T10:30:00Z',
      read_at: null,
      sender_name: 'John Doe',
      receiver_name: profile?.full_name || 'You',
      property_title: 'Modern Villa in Lusaka'
    },
    {
      id: '2',
      sender_id: user?.id || '',
      receiver_id: 'user2',
      message: 'Yes, the property is available. Would you like to schedule a tour?',
      created_at: '2024-03-24T11:00:00Z',
      read_at: '2024-03-24T11:05:00Z',
      sender_name: profile?.full_name || 'You',
      receiver_name: 'Jane Smith',
      property_title: 'Modern Villa in Lusaka'
    },
    {
      id: '3',
      sender_id: 'user3',
      receiver_id: user?.id || '',
      message: 'What is the asking price for the beach house?',
      created_at: '2024-03-24T09:15:00Z',
      read_at: null,
      sender_name: 'Mike Johnson',
      receiver_name: profile?.full_name || 'You',
      property_title: 'Beach House Paradise'
    }
  ];

  useState(() => {
    setTimeout(() => {
      setMessages(mockMessages);
      setLoading(false);
    }, 1000);
  });

  const filteredMessages = messages.filter(msg =>
    msg.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.property_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = messages.filter(msg => !msg.read_at && msg.receiver_id === user?.id).length;

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedMessage) return;

    // Add new message logic here
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Messages List */}
        <div className="w-96 border-r border-gray-200 bg-white overflow-y-auto">
          <div className="p-4">
            <h2 className="font-semibold text-gray-900 mb-4">Conversations</h2>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-gray-100 h-16 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : filteredMessages.length > 0 ? (
              <div className="space-y-2">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedMessage?.id === message.id
                        ? 'bg-blue-50 border-blue-200'
                        : 'hover:bg-gray-50'
                    } ${!message.read_at && message.receiver_id === user?.id ? 'border-l-4 border-blue-500' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900 truncate">
                            {message.sender_name}
                          </p>
                          <span className="text-xs text-gray-500">
                            {new Date(message.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {message.message}
                        </p>
                        {message.property_title && (
                          <p className="text-xs text-blue-600 mt-1">
                            {message.property_title}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No messages found</p>
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedMessage ? (
            <>
              {/* Message Header */}
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedMessage.sender_name}</p>
                      {selectedMessage.property_title && (
                        <p className="text-sm text-blue-600">{selectedMessage.property_title}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="flex justify-start">
                  <div className="max-w-md">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">{selectedMessage.sender_name}</p>
                      <p className="text-gray-900">{selectedMessage.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(selectedMessage.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Add more messages here */}
                <div className="flex justify-end">
                  <div className="max-w-md">
                    <div className="bg-blue-500 text-white rounded-lg p-4">
                      <p className="text-sm text-blue-100 mb-1">You</p>
                      <p>Thanks for your interest! The property is still available.</p>
                      <p className="text-xs text-blue-200 mt-2">
                        {new Date().toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 px-6 py-4">
                <div className="flex gap-3">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a message from the list to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
