import React from "react";
import { Message } from "../../types";
import { MessageBubble } from "./MessageBubble";

interface Props {
  messages: Message[];
  currentUser: string;
}

export const ChatWindow: React.FC<Props> = ({ messages, currentUser }) => {
  return (
    <div
      style={{
        height: "400px",
        overflowY: "auto",
        border: "1px solid #ccc",
        padding: 10,
      }}
    >
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} currentUser={currentUser} />
      ))}
    </div>
  );
};
