import { createClient } from './client';
import type {
  Chat,
  ChatParticipant,
  Message,
  Profile,
  ChatWithDetails,
  MessageWithSender,
  MessageReadReceipt,
} from '@/types/database.types';

/**
 * Get all chats for the current user with participant details and last message
 */
export async function getUserChats(userId: string): Promise<ChatWithDetails[]> {
  const supabase = createClient();

  // Get all chat IDs where user is a participant
  const { data: participantData, error: participantError } = await supabase
    .from('chat_participants')
    .select('chat_id')
    .eq('user_id', userId);

  if (participantError) throw participantError;
  if (!participantData || participantData.length === 0) return [];

  const chatIds = participantData.map((p) => p.chat_id);

  // Get chat details
  const { data: chats, error: chatsError } = await supabase
    .from('chats')
    .select('*')
    .in('id', chatIds)
    .order('updated_at', { ascending: false });

  if (chatsError) throw chatsError;
  if (!chats) return [];

  // For each chat, get participants and last message
  const chatsWithDetails = await Promise.all(
    chats.map(async (chat) => {
      // Get participants
      const { data: participants } = await supabase
        .from('chat_participants')
        .select(
          `
          user_id,
          profiles:user_id (*)
        `
        )
        .eq('chat_id', chat.id);

      // Get last message
      const { data: lastMessage } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chat.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Count unread messages
      const { data: participantInfo } = await supabase
        .from('chat_participants')
        .select('last_read_at')
        .eq('chat_id', chat.id)
        .eq('user_id', userId)
        .single();

      let unreadCount = 0;
      if (participantInfo?.last_read_at) {
        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('chat_id', chat.id)
          .neq('sender_id', userId)
          .gt('created_at', participantInfo.last_read_at);
        unreadCount = count || 0;
      } else {
        // If never read, count all messages from others
        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('chat_id', chat.id)
          .neq('sender_id', userId);
        unreadCount = count || 0;
      }

      return {
        ...chat,
        participants: participants?.map((p: any) => p.profiles).filter(Boolean) || [],
        last_message: lastMessage || null,
        unread_count: unreadCount,
      };
    })
  );

  return chatsWithDetails;
}

/**
 * Get all messages for a specific chat with read receipts
 */
export async function getChatMessages(chatId: string): Promise<MessageWithSender[]> {
  const supabase = createClient();

  const { data: messages, error } = await supabase
    .from('messages')
    .select(
      `
      *,
      sender:sender_id (*)
    `
    )
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  // Get read receipts for all messages in this chat
  const messageIds = (messages || []).map((msg: any) => msg.id);
  const { data: receipts } = await supabase
    .from('message_read_receipts')
    .select('*')
    .in('message_id', messageIds);

  // Group receipts by message_id
  const receiptsByMessage = (receipts || []).reduce((acc: any, receipt: any) => {
    if (!acc[receipt.message_id]) {
      acc[receipt.message_id] = [];
    }
    acc[receipt.message_id].push(receipt);
    return acc;
  }, {});

  return (messages || []).map((msg: any) => ({
    ...msg,
    sender: msg.sender,
    read_receipts: receiptsByMessage[msg.id] || [],
  }));
}

/**
 * Send a new message to a chat
 */
export async function sendMessage(
  chatId: string,
  senderId: string,
  text: string,
  imageUrl?: string,
  imageMetadata?: any
): Promise<Message> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('messages')
    .insert({
      chat_id: chatId,
      sender_id: senderId,
      text: text || null,
      image_url: imageUrl || null,
      image_metadata: imageMetadata || null,
      is_read: false,
      is_edited: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Edit an existing message
 */
export async function editMessage(
  messageId: string,
  newText: string
): Promise<Message> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('messages')
    .update({
      text: newText,
      is_edited: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', messageId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Mark all messages in a chat as read for the current user
 */
export async function markChatAsRead(chatId: string, userId: string): Promise<void> {
  const supabase = createClient();

  // Update the last_read_at timestamp for the user in this chat
  const { error } = await supabase
    .from('chat_participants')
    .update({
      last_read_at: new Date().toISOString(),
    })
    .eq('chat_id', chatId)
    .eq('user_id', userId);

  if (error) throw error;
}

/**
 * Create or get a direct chat between two users (RLS-compatible using RPC)
 */
export async function getOrCreateDirectChat(
  user1Id: string,
  user2Id: string
): Promise<Chat> {
  const supabase = createClient();

  // Use RPC function to find existing chat (bypasses RLS)
  const { data: existingChatId, error: rpcError } = await supabase
    .rpc('find_direct_chat_between_users', {
      user1_id: user1Id,
      user2_id: user2Id,
    });

  if (rpcError) {
    console.error('RPC error finding chat:', rpcError);
  }

  // If chat exists, fetch and return it
  if (existingChatId) {
    const { data: existingChat, error: fetchError } = await supabase
      .from('chats')
      .select('*')
      .eq('id', existingChatId)
      .single();

    if (existingChat && !fetchError) {
      return existingChat;
    }
  }

  // No existing chat found, create new one using RPC
  const { data: newChatId, error: createError } = await supabase
    .rpc('create_direct_chat', {
      user1_id: user1Id,
      user2_id: user2Id,
    });

  if (createError) throw createError;

  // Fetch the newly created chat (now we're a participant so SELECT works)
  const { data: newChat, error: fetchError } = await supabase
    .from('chats')
    .select('*')
    .eq('id', newChatId)
    .single();

  if (fetchError) throw fetchError;

  return newChat;
}

/**
 * Check if a user is a participant in a chat
 */
export async function isUserInChat(chatId: string, userId: string): Promise<boolean> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('chat_participants')
    .select('id')
    .eq('chat_id', chatId)
    .eq('user_id', userId)
    .single();

  if (error) return false;
  return !!data;
}

/**
 * Get chat participants
 */
export async function getChatParticipants(chatId: string): Promise<Profile[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('chat_participants')
    .select(
      `
      user_id,
      profiles:user_id (*)
    `
    )
    .eq('chat_id', chatId);

  if (error) throw error;

  return (data || []).map((p: any) => p.profiles).filter(Boolean);
}

/**
 * Mark a message as read by creating a read receipt
 */
export async function markMessageAsRead(
  messageId: string,
  userId: string
): Promise<MessageReadReceipt | null> {
  const supabase = createClient();

  // Check if receipt already exists
  const { data: existing } = await supabase
    .from('message_read_receipts')
    .select('*')
    .eq('message_id', messageId)
    .eq('user_id', userId)
    .single();

  if (existing) {
    return existing;
  }

  // Create new read receipt
  const { data, error } = await supabase
    .from('message_read_receipts')
    .insert({
      message_id: messageId,
      user_id: userId,
      read_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating read receipt:', error);
    return null;
  }

  return data;
}

/**
 * Mark all unread messages in a chat as read
 */
export async function markAllMessagesAsRead(
  chatId: string,
  userId: string
): Promise<void> {
  const supabase = createClient();

  // Get all messages in this chat that don't have a read receipt from this user
  const { data: messages } = await supabase
    .from('messages')
    .select('id, sender_id')
    .eq('chat_id', chatId)
    .neq('sender_id', userId); // Don't mark own messages as read

  if (!messages || messages.length === 0) return;

  // Get existing receipts
  const { data: existingReceipts } = await supabase
    .from('message_read_receipts')
    .select('message_id')
    .eq('user_id', userId)
    .in('message_id', messages.map(m => m.id));

  const existingMessageIds = new Set(
    (existingReceipts || []).map(r => r.message_id)
  );

  // Create receipts for messages that don't have one
  const receiptsToCreate = messages
    .filter(msg => !existingMessageIds.has(msg.id))
    .map(msg => ({
      message_id: msg.id,
      user_id: userId,
      read_at: new Date().toISOString(),
    }));

  if (receiptsToCreate.length > 0) {
    const { error } = await supabase
      .from('message_read_receipts')
      .insert(receiptsToCreate);

    if (error) {
      console.error('Error creating read receipts:', error);
    }
  }
}
