
// IMPORT React
import React, { useRef, useEffect } from "react";

// IMPORT Component
import Message from "./Message";

// IMPORT Style
import '../style/chat-container.css'

const ChatContainer = ({ messages, onEditMessage, onDeleteMessage, state, history }) => {
  const chatContainerRef = useRef(null);

  // Scroll to the bottom of the chat container when new messages are added
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [messages]);

  return (
    <div ref={chatContainerRef} className="chat-container">
      {messages.map((message, index) => (
        <Message
          key={index}
          message={message}
          onEdit={(editedText) => onEditMessage(index, editedText)}
          onDelete={() => onDeleteMessage(index)}
          busy={state.busy}
        />
      ))}
    </div>
  );
};

export default ChatContainer;
