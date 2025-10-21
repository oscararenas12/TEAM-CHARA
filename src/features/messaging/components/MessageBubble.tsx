import React from "react";
import { Message } from "../../../types";

interface Props {
  message: Message;
  currentUser: string;
}

export const MessageBubble: React.FC<Props> = ({ message, currentUser }) => {
  const isOwn = message.user === currentUser;
  return (
    <div
      style={{
        textAlign: isOwn ? "right" : "left",
        margin: "8px 0",
      }}
    >
      <div
        style={{
          display: "inline-block",
          backgroundColor: isOwn ? "#DCF8C6" : "#FFF",
          borderRadius: 10,
          padding: "10px 15px",
        }}
      >
        <strong>{!isOwn && message.user}</strong>
        <p>{message.text}</p>
      </div>
    </div>
  );
};
