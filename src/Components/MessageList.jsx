import React from "react";
import MessageItem from "./MessageItem";

function MessageList({ messages, setImageData, setOpenImage }) {
  return (
    <>
      {messages.map((message) => (
        <MessageItem
          key={message.messageId}
          message={message}
          setImageData={setImageData}
          setOpenImage={setOpenImage}
        />
      ))}
    </>
  );
}

export default MessageList;
