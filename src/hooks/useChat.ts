'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  getUserChats,
  getChatMessages,
  sendMessage,
  editMessage,
  markChatAsRead,
  markAllMessagesAsRead,
} from '@/lib/supabase/chat';
import type { ChatWithDetails, MessageWithSender } from '@/types/database.types';

export function useChat(userId: string | undefined) {
  const [chats, setChats] = useState<ChatWithDetails[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatWithDetails | null>(null);
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all chats for the user
  const loadChats = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      const userChats = await getUserChats(userId);
      setChats(userChats);
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : typeof err === 'object' && err !== null
        ? JSON.stringify(err)
        : 'Failed to load chats';
      setError(errorMessage);
      console.error('Error loading chats:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Load messages for a specific chat
  const loadMessages = useCallback(async (chatId: string) => {
    try {
      setError(null);
      const chatMessages = await getChatMessages(chatId);
      setMessages(chatMessages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
      console.error('Error loading messages:', err);
    }
  }, []);

  // Select a chat and load its messages
  const selectChat = useCallback(
    async (chat: ChatWithDetails) => {
      setSelectedChat(chat);
      await loadMessages(chat.id);

      // Mark chat as read and create read receipts for all messages
      if (userId) {
        try {
          await markChatAsRead(chat.id, userId);
          await markAllMessagesAsRead(chat.id, userId);

          // Update the chat's unread count locally
          setChats((prevChats) =>
            prevChats.map((c) =>
              c.id === chat.id ? { ...c, unread_count: 0 } : c
            )
          );
        } catch (err) {
          console.error('Error marking chat as read:', err);
        }
      }
    },
    [userId, loadMessages]
  );

  // Send a message
  const handleSendMessage = useCallback(
    async (chatId: string, text: string) => {
      if (!userId || !text.trim()) return;

      try {
        setError(null);
        const newMessage = await sendMessage(chatId, userId, text);

        // Optimistically add message to local state
        const supabase = createClient();
        const { data: sender } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (sender) {
          const messageWithSender: MessageWithSender = {
            ...newMessage,
            sender,
          };
          setMessages((prev) => [...prev, messageWithSender]);
        }

        // Refresh chats to update last message
        await loadChats();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send message');
        console.error('Error sending message:', err);
        throw err;
      }
    },
    [userId, loadChats]
  );

  // Edit a message
  const handleEditMessage = useCallback(async (messageId: string, newText: string) => {
    try {
      setError(null);
      const updatedMessage = await editMessage(messageId, newText);

      // Update message in local state
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, text: newText, is_edited: true, updated_at: updatedMessage.updated_at }
            : msg
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to edit message');
      console.error('Error editing message:', err);
      throw err;
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadChats();
  }, [loadChats]);

  // Realtime subscription for messages and read receipts
  useEffect(() => {
    if (!selectedChat?.id || !userId) return;

    const supabase = createClient();

    // Subscribe to new messages, updates, and read receipts in the selected chat
    const channel = supabase
      .channel(`chat:${selectedChat.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${selectedChat.id}`,
        },
        async (payload) => {
          console.log('🔴 New message received:', payload.new);

          // Fetch the sender profile
          const { data: sender } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', payload.new.sender_id)
            .single();

          if (sender) {
            const newMessage: MessageWithSender = {
              ...(payload.new as any),
              sender,
              read_receipts: [],
            };

            // Only add if it's not already in the list (avoid duplicates from optimistic updates)
            setMessages((prev) => {
              const exists = prev.some((msg) => msg.id === newMessage.id);
              if (exists) return prev;
              return [...prev, newMessage];
            });

            // Automatically mark the message as read if it's from someone else
            if (payload.new.sender_id !== userId) {
              const { markMessageAsRead } = await import('@/lib/supabase/chat');
              await markMessageAsRead(payload.new.id, userId);
            }
          }

          // Refresh chats to update last message
          loadChats();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${selectedChat.id}`,
        },
        (payload) => {
          console.log('✏️ Message updated:', payload.new);

          // Update the message in local state
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === payload.new.id
                ? { ...msg, ...(payload.new as any) }
                : msg
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'message_read_receipts',
        },
        async (payload: any) => {
          console.log('👁️ Read receipt created:', payload.new);

          // Update the message's read receipts in local state
          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.id === payload.new.message_id) {
                const existingReceipts = msg.read_receipts || [];
                const receiptExists = existingReceipts.some(
                  (r) => r.user_id === payload.new.user_id
                );
                if (!receiptExists) {
                  return {
                    ...msg,
                    read_receipts: [...existingReceipts, payload.new],
                  };
                }
              }
              return msg;
            })
          );
        }
      )
      .subscribe();

    // Cleanup: unsubscribe when chat changes or component unmounts
    return () => {
      console.log('🔌 Unsubscribing from chat:', selectedChat.id);
      supabase.removeChannel(channel);
    };
  }, [selectedChat?.id, userId, loadChats]);

  return {
    chats,
    selectedChat,
    messages,
    loading,
    error,
    selectChat,
    sendMessage: handleSendMessage,
    editMessage: handleEditMessage,
    refreshChats: loadChats,
  };
}
