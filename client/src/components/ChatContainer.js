import React, { useRef, useEffect } from "react";

const ChatContainer = ({ messages }) => {
  const chatContainerRef = useRef(null);

  const handleImageLoad = () => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  useEffect(() => {
    const hasImages = messages.some((message) => message.imageFile);
    if (hasImages) {
      // Add an event listener for image load only when images are present
      const images = chatContainerRef.current.querySelectorAll("img");
      images.forEach((image) =>
        image.addEventListener("load", handleImageLoad)
      );

      // Clean up event listeners on unmount (optional)
      return () => {
        images.forEach((image) =>
          image.removeEventListener("load", handleImageLoad)
        );
      };
    } else {
      // Scroll for text messages as before
      handleImageLoad();
    }
  }, [messages]);

  return (
    <div ref={chatContainerRef} className="chat-container">
      {messages.map((message, index) => (
        <div key={index} className={`message ${message.sender}`}>
          {message.text && <p>{message.text}</p>}
          {message.imageFile && (
            <img
              src={URL.createObjectURL(message.imageFile)}
              alt="Uploaded"
              onLoad={handleImageLoad}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatContainer;
