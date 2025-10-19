import React from "react";
import { ChatWindow } from "../components/ChatSystem/ChatWindow";
import { MessageInput } from "../components/ChatSystem/MessageInput";
import { Message } from "../types";

function Messages() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const currentUser = "CurrentUser"; // Replace with actual current user logic

  const handleSend = (text: string) => {
    const newMessage: Message = {
      id: Math.random().toString(36),
      user: currentUser,
      text,
      timestamp: Date.now(),
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div>
      <h1>Messages Page</h1>
      <ChatWindow messages={messages} currentUser={currentUser} />
      <MessageInput onSend={handleSend} />
    </div>
  );
}

export default Messages;
