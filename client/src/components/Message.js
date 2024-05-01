import React from "react";

const Message = ({ message }) => {
  const { text, sender } = message || {};
  const isUser = sender === "user";

  return (
    <div className={`message ${isUser ? "user" : "bot"}`}>
      <p>{text}</p>
    </div>
  );
};

export default Message;
