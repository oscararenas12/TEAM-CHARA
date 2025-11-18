"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import hatImg from "@/assets/hat.png";
import "./styles.css";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useChat } from "@/hooks/useChat";
import type { ChatWithDetails } from "@/types/database.types";
import { getOrCreateDirectChat } from "@/lib/supabase/chat";
import { createClient } from "@/lib/supabase/client";

export default function MessagesPage() {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
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

  // 🔥🔥🔥 THE ONLY CHANGE YOU ASKED FOR — SORT CHATS
  const sortedChats = chats.slice().sort((a, b) => {
    const aTime = new Date(a.last_message?.created_at || 0).getTime();
    const bTime = new Date(b.last_message?.created_at || 0).getTime();
    return bTime - aTime; // Newest first
  });

  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);


  // Handle URL parameters (to open specific chat)
  useEffect(() => {
    const targetUserId = searchParams.get('to');
    const autoMessage = searchParams.get('autoMessage');

    if (!profile?.id || !targetUserId || chatsLoading || hasProcessedParams.current) return;

    async function openOrCreateChat() {
      if (!profile?.id || !targetUserId) return;

      try {
        hasProcessedParams.current = true;
        setIsCreatingChat(true);

        const chat = await getOrCreateDirectChat(profile.id, targetUserId);
        await refreshChats();

        const supabase = createClient();
        const { data: chatDetails } = await supabase
          .from("chats")
          .select("*")
          .eq("id", chat.id)
          .single();

        const { data: participants } = await supabase
          .from("chat_participants")
          .select(`user_id, profiles:user_id (*)`)
          .eq("chat_id", chat.id);

        const chatToSelect: ChatWithDetails = {
          ...chatDetails,
          participants: participants?.map((p: any) => p.profiles).filter(Boolean) || [],
          last_message: null,
          unread_count: 0,
        };

        selectChat(chatToSelect);

        if (autoMessage) {
          await sendMessage(chat.id, autoMessage);
        }

        window.history.replaceState({}, '', '/messages');

      } catch (err) {
        console.error("❌ Error opening chat:", err);
        alert(`Failed to open chat: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
      } finally {
        setIsCreatingChat(false);
      }
    }

    openOrCreateChat();
  }, [profile?.id, searchParams, chatsLoading]);

  const handleChatSelect = (chat: ChatWithDetails) => selectChat(chat);

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

  const handleStartEdit = (messageId: string, currentText: string) => {
    setEditingMessageId(messageId);
    setEditText(currentText);
  };

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

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditText("");
  };

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const getChatDisplayName = (chat: ChatWithDetails): string => {
    if (chat.is_group) return chat.title || "Group Chat";

    const other = chat.participants.find((p) => p.id !== profile?.id);
    if (!other) return "Unknown User";

    return `${other.first_name || ""} ${other.last_name || ""}`.trim() || other.email;
  };

  const getChatAvatar = (chat: ChatWithDetails) =>
    getChatDisplayName(chat).charAt(0).toUpperCase();

  const formatMessageTime = (timestamp: string): string =>
    new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const formatChatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diff < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const getReadReceiptStatus = (message: any): string | null => {
    if (message.sender_id !== profile?.id) return null;
    const receipts = (message.read_receipts || []).filter(
      (r: any) => r.user_id !== profile?.id
    );
    if (receipts.length === 0) return "Delivered";

    const latest = receipts.reduce((a: any, b: any) =>
      new Date(a.read_at) > new Date(b.read_at) ? a : b
    );
    return `Read at ${new Date(latest.read_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

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
      <p className="subtext">Connect with buyers and sellers</p>

      <div className="chat-container">
        {/* Chat List */}
        <div className="chat-list">
          {sortedChats.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
              No conversations yet. Start chatting with other students!
            </div>
          ) : (
            sortedChats.map((chat) => (
              <div
                key={chat.id}
                className={`chat-item ${
                  selectedChat?.id === chat.id ? "active" : ""
                }`}
                onClick={() => handleChatSelect(chat)}
              >
                <div className="chat-avatar">{getChatAvatar(chat)}</div>

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
              <div className="chat-avatar">{getChatAvatar(selectedChat)}</div>
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
                  const isOwn = message.sender_id === profile?.id;
                  const isEditing = editingMessageId === message.id;

                  const lastOwnIndex = profile?.id
                    ? messages.map(m => m.sender_id).lastIndexOf(profile.id)
                    : -1;

                  const isLastOwn = isOwn && index === lastOwnIndex;

                  return (
                    <div
                      key={`${message.id}-${index}`}
                      className={`message ${isOwn ? "sent" : "received"}`}
                    >
                      {isEditing ? (
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
                            <button
                              onClick={handleCancelEdit}
                              className="edit-cancel-btn"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="message-content">
                            {message.text}
                            {message.is_edited && (
                              <span
                                style={{
                                  fontSize: "0.8em",
                                  color: "#888",
                                  marginLeft: "8px",
                                }}
                              >
                                (edited)
                              </span>
                            )}
                          </div>
                          <div className="message-time">
                            {formatMessageTime(message.created_at)}
                          </div>

                          {isLastOwn && getReadReceiptStatus(message) && (
                            <div className="message-read-status">
                              {getReadReceiptStatus(message)}
                            </div>
                          )}

                          {isOwn && (
                            <button
                              onClick={() =>
                                handleStartEdit(message.id, message.text)
                              }
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
              <div ref={messagesEndRef} />
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
