import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send, Phone, Mail, User } from 'lucide-react';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  property_id?: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
  sender_profile?: {
    full_name: string;
    avatar_url?: string;
    phone?: string;
    email?: string;
  };
  property?: {
    title: string;
  };
}

interface Conversation {
  contact_id: string;
  contact_profile: {
    full_name: string;
    avatar_url?: string;
    phone?: string;
    email?: string;
  };
  last_message: Message;
  unread_count: number;
  property_title?: string;
}

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      // Load messages where user is sender or recipient
      const { data: sentMessages, error: sentError } = await supabase
        .from('messages')
        .select(`
          *,
          recipient_profile:profiles!messages_recipient_id_fkey (
            full_name,
            avatar_url,
            phone,
            email
          ),
          property:properties (
            title
          )
        `)
        .eq('sender_id', user!.id)
        .order('created_at', { ascending: false });

      const { data: receivedMessages, error: receivedError } = await supabase
        .from('messages')
        .select(`
          *,
          sender_profile:profiles!messages_sender_id_fkey (
            full_name,
            avatar_url,
            phone,
            email
          ),
          property:properties (
            title
          )
        `)
        .eq('recipient_id', user!.id)
        .order('created_at', { ascending: false });

      if (sentError || receivedError) throw sentError || receivedError;

      const allMessages = [...(sentMessages || []), ...(receivedMessages || [])];

      // Group by contact
      const conversationMap = new Map<string, Conversation>();

      allMessages.forEach((message: any) => {
        const isSent = message.sender_id === user!.id;
        const contactId = isSent ? message.recipient_id : message.sender_id;
        const contactProfile = isSent ? message.recipient_profile : message.sender_profile;

        if (!conversationMap.has(contactId)) {
          conversationMap.set(contactId, {
            contact_id: contactId,
            contact_profile: contactProfile,
            last_message: message,
            unread_count: 0,
            property_title: message.property?.title
          });
        }

        const conversation = conversationMap.get(contactId)!;
        if (!isSent && !message.is_read) {
          conversation.unread_count++;
        }

        // Update last message if this one is more recent
        if (new Date(message.created_at) > new Date(conversation.last_message.created_at)) {
          conversation.last_message = message;
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (contactId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender_profile:profiles!messages_sender_id_fkey (
            full_name,
            avatar_url
          ),
          recipient_profile:profiles!messages_recipient_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .or(`and(sender_id.eq.${user!.id},recipient_id.eq.${contactId}),and(sender_id.eq.${contactId},recipient_id.eq.${user!.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('sender_id', contactId)
        .eq('recipient_id', user!.id)
        .eq('is_read', false);

    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!selectedConversation || !newMessage.trim()) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user!.id,
          recipient_id: selectedConversation,
          subject: 'Property Inquiry', // Could be made dynamic
          message: newMessage.trim(),
          is_read: false
        });

      if (error) throw error;

      setNewMessage('');
      await loadMessages(selectedConversation);
      await loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="flex h-96">
            <div className="w-1/3 bg-gray-200 rounded mr-4"></div>
            <div className="flex-1 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-2">Communicate with buyers, sellers, and agents</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <CardDescription>
              {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y max-h-[500px] overflow-y-auto">
              {conversations.length > 0 ? (
                conversations.map((conversation) => (
                  <div
                    key={conversation.contact_id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation === conversation.contact_id ? 'bg-primary/5 border-r-2 border-primary' : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation.contact_id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={conversation.contact_profile.avatar_url} />
                        <AvatarFallback>
                          {conversation.contact_profile.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">
                            {conversation.contact_profile.full_name}
                          </p>
                          {conversation.unread_count > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {conversation.unread_count}
                            </Badge>
                          )}
                        </div>
                        {conversation.property_title && (
                          <p className="text-sm text-muted-foreground truncate">
                            Re: {conversation.property_title}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.last_message.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(conversation.last_message.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">No conversations yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Start a conversation by inquiring about a property or responding to inquiries.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedConversation ? (
                conversations.find(c => c.contact_id === selectedConversation)?.contact_profile.full_name
              ) : (
                'Select a conversation'
              )}
            </CardTitle>
            {selectedConversation && (
              <CardDescription>
                {conversations.find(c => c.contact_id === selectedConversation)?.property_title &&
                  `Regarding: ${conversations.find(c => c.contact_id === selectedConversation)?.property_title}`
                }
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="flex flex-col h-[500px]">
            {selectedConversation ? (
              <>
                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => {
                    const isSent = message.sender_id === user!.id;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isSent
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.message}</p>
                          <p className={`text-xs mt-1 ${isSent ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                      rows={2}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || sending}
                      className="self-end"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Contact Info */}
                {selectedConversation && (
                  <div className="border-t p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={conversations.find(c => c.contact_id === selectedConversation)?.contact_profile.avatar_url} />
                          <AvatarFallback>
                            {conversations.find(c => c.contact_id === selectedConversation)?.contact_profile.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {conversations.find(c => c.contact_id === selectedConversation)?.contact_profile.full_name}
                          </p>
                          <p className="text-sm text-muted-foreground">Property Contact</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {conversations.find(c => c.contact_id === selectedConversation)?.contact_profile.phone && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.href = `tel:${conversations.find(c => c.contact_id === selectedConversation)?.contact_profile.phone}`}
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                        )}
                        {conversations.find(c => c.contact_id === selectedConversation)?.contact_profile.email && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.href = `mailto:${conversations.find(c => c.contact_id === selectedConversation)?.contact_profile.email}`}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a conversation from the list to start messaging.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Messages;
