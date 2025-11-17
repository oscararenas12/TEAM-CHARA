"use client";

// Mock messaging system
import React, { useState, useEffect } from "react";
import { Message, User } from "@/types";
import hatImg from "@/assets/hat.png";
import "./styles.css";
import { useUserProfile } from "@/hooks/useUserProfile";

interface MockChat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

export default function MessagesPage() {
  const { profile } = useUserProfile();
  const [selectedChat, setSelectedChat] = useState<MockChat | null>(null);
  const [messageText, setMessageText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  // Mock chat data for demonstration Line 18 - 97
  const mockChats: MockChat[] = [
    {
      id: "1",
      name: "John Doe",
      lastMessage: "Hey, is the laptop still available?",
      timestamp: "2:30 PM",
      unreadCount: 2,
    },
    {
      id: "2",
      name: "Sarah Smith",
      lastMessage: "Thanks for the textbook!",
      timestamp: "1:15 PM",
      unreadCount: 0,
    },
    {
      id: "3",
      name: "Mike Johnson",
      lastMessage: "When can we meet for the exchange?",
      timestamp: "12:45 PM",
      unreadCount: 1,
    },
  ];

  const mockMessages: { [key: string]: Message[] } = {
    "1": [
      {
        id: "1",
        text: "Hi! I saw your laptop listing",
        sender: { id: "user1", username: "John Doe" },
        chatId: "1",
        timestamp: new Date("2025-10-21T14:25:00"),
        messageType: "text",
        isRead: true,
      },
      {
        id: "2",
        text: "Hey, is the laptop still available?",
        sender: { id: "user1", username: "John Doe" },
        chatId: "1",
        timestamp: new Date("2025-10-21T14:30:00"),
        messageType: "text",
        isRead: false,
      },
    ],
    "2": [
      {
        id: "3",
        text: "Thanks for the textbook!",
        sender: { id: "user2", username: "Sarah Smith" },
        chatId: "2",
        timestamp: new Date("2025-10-21T13:15:00"),
        messageType: "text",
        isRead: true,
      },
    ],
    "3": [
      {
        id: "4",
        text: "When can we meet for the exchange?",
        sender: { id: "user3", username: "Mike Johnson" },
        chatId: "3",
        timestamp: new Date("2025-10-21T12:45:00"),
        messageType: "text",
        isRead: false,
      },
    ],
    "4": [
      {
        id: "5",
        text: "GAE",
        sender: { id: "user4", username: "Jonny" },
        chatId: "3",
        timestamp: new Date("2025-10-21T20:45:00"),
        messageType: "text",
        isRead: true,
      },
    ],
  };

  // Once backend is ready, replace with API call(s)
  const handleChatSelect = (chat: MockChat) => {
    setSelectedChat(chat);
    setMessages(mockMessages[chat.id] || []);
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: { id: "currentUser", username: "You" },
      chatId: selectedChat.id,
      timestamp: new Date(),
      messageType: "text",
      isRead: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="messages-page">
      <div className="messages-head">
        <h1 id="page-head">Messages</h1>
        
      </div>

      <div className="chat-container">
        {/* Chat List */}
        <div className="chat-list">
          {mockChats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${
                selectedChat?.id === chat.id ? "active" : ""
              }`}
              onClick={() => handleChatSelect(chat)}
            >
              <div className="chat-avatar">
                {chat.name.charAt(0).toUpperCase()}
              </div>
              <div className="chat-info">
                <div className="chat-name">{chat.name}</div>
                <div className="chat-last-message">{chat.lastMessage}</div>
              </div>
              <div className="chat-meta">
                <div className="chat-time">{chat.timestamp}</div>
                {chat.unreadCount > 0 && (
                  <div className="chat-unread">{chat.unreadCount}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Window */}
        {selectedChat ? (
          <div className="chat-window">
            <div className="chat-window-header">
              <div className="chat-avatar">
                {selectedChat.name.charAt(0).toUpperCase()}
              </div>
              <div className="chat-window-title">{selectedChat.name}</div>
            </div>

            <div className="messages-container">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${
                    message.sender.username === "You" ? "sent" : "received"
                  }`}
                >
                  <div className="message-content">{message.text}</div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}
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
