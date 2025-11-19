"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import hatImg from "@/assets/hat.png";
import "./styles.css";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useChat } from "@/hooks/useChat";
import type { ChatWithDetails } from "@/types/database.types";
import { getOrCreateDirectChat } from "@/lib/supabase/chat";
import { createClient } from "@/lib/supabase/client";

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="messages-page">
        <div className="messages-head">
          <h1 id="page-head">Messages</h1>
        </div>
        <p className="subtext">Loading...</p>
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}

function MessagesContent() {
  const searchParams = useSearchParams();
  const { profile, loading: profileLoading } = useUserProfile();
  const {
    chats,
    selectedChat,
    messages,
    loading: chatsLoading,
    error,
    selectChat,
    sendMessage,
    editMessage,
    refreshChats,
  } = useChat(profile?.id);

  const [messageText, setMessageText] = useState<string>("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const hasProcessedParams = useRef(false);

  // Handle URL parameters (to open a chat with a specific user)
  useEffect(() => {
    const targetUserId = searchParams.get('to');
    const autoMessage = searchParams.get('autoMessage');

    console.log('🔍 URL params:', { targetUserId, autoMessage, profileId: profile?.id, chatsLoading, hasProcessed: hasProcessedParams.current });

    if (!profile?.id || !targetUserId || chatsLoading || hasProcessedParams.current) return;

    async function openOrCreateChat() {
      if (!profile?.id || !targetUserId) return;

      try {
        hasProcessedParams.current = true;
        setIsCreatingChat(true);
        console.log('🚀 Creating/getting chat between:', profile.id, 'and', targetUserId);

        // Get or create a direct chat with the target user
        const chat = await getOrCreateDirectChat(profile.id, targetUserId);
        console.log('✅ Chat created/retrieved:', chat);

        // Refresh chats to get the updated list with the new/existing chat
        await refreshChats();

        // Find the chat in the list and select it
        const supabase = createClient();
        const { data: chatDetails, error: chatError } = await supabase
          .from('chats')
          .select('*')
          .eq('id', chat.id)
          .single();

        if (chatError) {
          console.error('❌ Error fetching chat details:', chatError);
          throw chatError;
        }

        console.log('📝 Chat details:', chatDetails);

        if (chatDetails) {
          // Get participants for this chat
          const { data: participants, error: participantsError } = await supabase
            .from('chat_participants')
            .select(`
              user_id,
              profiles:user_id (*)
            `)
            .eq('chat_id', chat.id);

          if (participantsError) {
            console.error('❌ Error fetching participants:', participantsError);
            throw participantsError;
          }

          console.log('👥 Participants:', participants);

          const chatToSelect: ChatWithDetails = {
            ...chatDetails,
            participants: participants?.map((p: any) => p.profiles).filter(Boolean) || [],
            last_message: null,
            unread_count: 0,
          };

          selectChat(chatToSelect);

          // If there's an auto-message, send it
          if (autoMessage) {
            console.log('📨 Auto-sending message:', autoMessage);
            await sendMessage(chat.id, autoMessage);
          }

          // Clear URL parameters after everything is done
          window.history.replaceState({}, '', '/messages');
        }
      } catch (err) {
        console.error('❌ Error opening chat:', err);
        alert(`Failed to open chat: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
      } finally {
        setIsCreatingChat(false);
      }
    }

    openOrCreateChat();
  }, [profile?.id, searchParams, chatsLoading]);

  // Handle chat selection
  const handleChatSelect = (chat: ChatWithDetails) => {
    selectChat(chat);
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedChat) return;

    try {
      await sendMessage(selectedChat.id, messageText);
      setMessageText("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle starting to edit a message
  const handleStartEdit = (messageId: string, currentText: string) => {
    setEditingMessageId(messageId);
    setEditText(currentText);
  };

  // Handle saving an edited message
  const handleSaveEdit = async () => {
    if (!editingMessageId || !editText.trim()) return;

    try {
      await editMessage(editingMessageId, editText);
      setEditingMessageId(null);
      setEditText("");
    } catch (err) {
      console.error("Failed to edit message:", err);
    }
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditText("");
  };

  // Handle key press in edit mode
  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  // Helper function to get the other participant's name in a 1-on-1 chat
  const getChatDisplayName = (chat: ChatWithDetails): string => {
    if (chat.is_group) {
      return chat.title || "Group Chat";
    }

    // For 1-on-1 chats, show the other person's name
    const otherParticipant = chat.participants.find(
      (p) => p.id !== profile?.id
    );

    if (otherParticipant) {
      const firstName = otherParticipant.first_name || "";
      const lastName = otherParticipant.last_name || "";
      return `${firstName} ${lastName}`.trim() || otherParticipant.email;
    }

    return "Unknown User";
  };

  // Helper function to get chat avatar initial
  const getChatAvatar = (chat: ChatWithDetails): string => {
    const displayName = getChatDisplayName(chat);
    return displayName.charAt(0).toUpperCase();
  };

  // Helper function to format timestamp
  const formatMessageTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper function to format last message time for chat list
  const formatChatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
    }
  };

  // Helper function to get read receipt status for a message
  const getReadReceiptStatus = (message: any): string | null => {
    // Only show read receipts for own messages
    if (message.sender_id !== profile?.id) return null;

    const readReceipts = message.read_receipts || [];

    // Get receipts from other users (not yourself)
    const otherUserReceipts = readReceipts.filter(
      (receipt: any) => receipt.user_id !== profile?.id
    );

    if (otherUserReceipts.length > 0) {
      // Message has been read - show the most recent read time
      const latestReceipt = otherUserReceipts.reduce((latest: any, current: any) => {
        return new Date(current.read_at) > new Date(latest.read_at) ? current : latest;
      }, otherUserReceipts[0]);

      const readDate = new Date(latestReceipt.read_at);
      return `Read at ${readDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      // Message has been delivered but not read
      return "Delivered";
    }
  };

  // Show loading state
  if (profileLoading || (chatsLoading && chats.length === 0)) {
    return (
      <div className="messages-page">
        <div className="messages-head">
          <h1 id="page-head">Messages</h1>
        </div>
        <p className="subtext">Loading your conversations...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="messages-page">
        <div className="messages-head">
          <h1 id="page-head">Messages</h1>
        </div>
        <p className="subtext" style={{ color: "red" }}>
          Error loading messages: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="messages-page">
      <div className="messages-head">
        <h1 id="page-head">Messages</h1>
      </div>

      <div className="chat-container">
        {/* Chat List */}
        <div className="chat-list">
          {chats.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
              No conversations yet. Start chatting with other students!
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                className={`chat-item ${
                  selectedChat?.id === chat.id ? "active" : ""
                }`}
                onClick={() => handleChatSelect(chat)}
              >
                <div className="chat-avatar">
                  {getChatAvatar(chat)}
                </div>
                <div className="chat-info">
                  <div className="chat-name">{getChatDisplayName(chat)}</div>
                  <div className="chat-last-message">
                    {chat.last_message?.text || "No messages yet"}
                  </div>
                </div>
                <div className="chat-meta">
                  <div className="chat-time">
                    {chat.last_message
                      ? formatChatTime(chat.last_message.created_at)
                      : ""}
                  </div>
                  {chat.unread_count > 0 && (
                    <div className="chat-unread">{chat.unread_count}</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Chat Window */}
        {selectedChat ? (
          <div className="chat-window">
            <div className="chat-window-header">
              <div className="chat-avatar">
                {getChatAvatar(selectedChat)}
              </div>
              <div className="chat-window-title">
                {getChatDisplayName(selectedChat)}
              </div>
            </div>

            <div className="messages-container">
              {messages.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((message, index) => {
                  const isOwnMessage = message.sender_id === profile?.id;
                  const isEditing = editingMessageId === message.id;

                  // Find the last message sent by the current user
                  const lastOwnMessageIndex = profile?.id
                    ? messages.map(m => m.sender_id).lastIndexOf(profile.id)
                    : -1;
                  const isLastOwnMessage = isOwnMessage && index === lastOwnMessageIndex;

                  return (
                    <div
                      key={message.id}
                      className={`message ${isOwnMessage ? "sent" : "received"}`}
                    >
                      {isEditing ? (
                        // Edit mode
                        <div className="message-edit-container">
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={handleEditKeyPress}
                            className="message-edit-input"
                            autoFocus
                          />
                          <div className="message-edit-buttons">
                            <button onClick={handleSaveEdit} className="edit-save-btn">
                              Save
                            </button>
                            <button onClick={handleCancelEdit} className="edit-cancel-btn">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View mode
                        <>
                          <div className="message-content">
                            {message.text}
                            {message.is_edited && (
                              <span style={{ fontSize: "0.8em", color: "#888", marginLeft: "8px" }}>
                                (edited)
                              </span>
                            )}
                          </div>
                          <div className="message-time">
                            {formatMessageTime(message.created_at)}
                          </div>
                          {isLastOwnMessage && getReadReceiptStatus(message) && (
                            <div className="message-read-status">
                              {getReadReceiptStatus(message)}
                            </div>
                          )}
                          {isOwnMessage && (
                            <button
                              onClick={() => handleStartEdit(message.id, message.text)}
                              className="message-edit-btn"
                              title="Edit message"
                            >
                              ⋯
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="message-input-container">
              <input
                type="text"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="message-input"
              />
              <button
                onClick={handleSendMessage}
                className="send-button"
                disabled={!messageText.trim()}
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="no-chat-selected">
            <img src={hatImg.src} alt="Student Mart" className="welcome-logo" />
            <h3>Welcome to Student Mart Messages</h3>
            <p>Select a conversation to start chatting with other students</p>
          </div>
        )}
      </div>
    </div>
  );
}
