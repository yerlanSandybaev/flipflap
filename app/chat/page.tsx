'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { Send, ArrowLeft } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  avatarUrl?: string;
}

interface Message {
  _id: string;
  senderId: User;
  receiverId: User;
  message: string;
  createdAt: string;
  read: boolean;
}

interface Conversation {
  user: User;
  lastMessage: Message;
}

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedUserId = searchParams.get('user');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchMessages(selectedUserId);
    }
  }, [selectedUserId]);

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/messages/conversations');
      const data = await res.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    try {
      const res = await fetch(`/api/messages/${userId}`);
      const data = await res.json();
      setMessages(data.messages || []);
      
      const conversation = conversations.find((c) => c.user._id === userId);
      if (conversation) {
        setSelectedUser(conversation.user);
      } else {
        const userRes = await fetch(`/api/users/search?q=`);
        const userData = await userRes.json();
        const user = userData.users?.find((u: User) => u._id === userId);
        if (user) setSelectedUser(user);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId || sending) return;

    setSending(true);
    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: selectedUserId,
          message: newMessage,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages([...messages, data.message]);
        setNewMessage('');
        fetchConversations();
        
        // Poll for AI response after 3 seconds
        setTimeout(() => {
          fetchMessages(selectedUserId);
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const selectUser = (userId: string) => {
    router.push(`/chat?user=${userId}`);
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto h-[calc(100vh-4rem)]">
        <h1 className="text-4xl font-bold text-black mb-6">Messages</h1>

        <div className="flex gap-6 h-[calc(100%-5rem)] border border-gray-200 rounded-lg overflow-hidden">
          {/* Conversations List */}
          <div className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No conversations yet. Start chatting with users!
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.user._id}
                  onClick={() => selectUser(conv.user._id)}
                  className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedUserId === conv.user._id ? 'bg-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {conv.user.avatarUrl ? (
                      <img
                        src={conv.user.avatarUrl}
                        alt={conv.user.name}
                        className="w-12 h-12 rounded-full border border-black"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center border border-black">
                        <span className="text-lg font-bold text-gray-600">
                          {conv.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-black truncate">{conv.user.name}</p>
                      <p className="text-sm text-gray-500 truncate">
                        {conv.lastMessage.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white">
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                  <button
                    onClick={() => router.push('/chat')}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  {selectedUser.avatarUrl ? (
                    <img
                      src={selectedUser.avatarUrl}
                      alt={selectedUser.name}
                      className="w-10 h-10 rounded-full border border-black"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border border-black">
                      <span className="font-bold text-gray-600">
                        {selectedUser.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <h2 className="text-xl font-bold text-black">{selectedUser.name}</h2>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isSent = msg.senderId._id === selectedUserId;
                      return (
                        <div
                          key={msg._id}
                          className={`flex ${isSent ? 'justify-start' : 'justify-end'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              isSent
                                ? 'bg-gray-100 text-black'
                                : 'bg-black text-white'
                            }`}
                          >
                            <p className="break-words">{msg.message}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isSent ? 'text-gray-500' : 'text-gray-300'
                              }`}
                            >
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
