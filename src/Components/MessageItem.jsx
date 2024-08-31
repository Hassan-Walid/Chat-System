import React, { useContext } from "react";
import { Avatar } from "@mui/material";
import { displayTime } from "../utils/dateUtils";
import { RoomContext } from "../Context/room";

function MessageItem({ message, setImageData, setOpenImage }) {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { currentUser } = useContext(RoomContext);
  return (
    <div
      className={
        message.sender.senderName === currentUser.username
          ? "chat_message"
          : "chat_reciver"
      }
    >
      <Avatar src={message.sender.senderImage} style={{ marginTop: "2.3%" }} />
      <div className="chat-section">
        <span className="usernameMessage">{message.sender.senderName}</span>
        <div className="contentMessage">
          <pre>{message.content}</pre>
          {message.attachmentFiles?.length > 0 &&
            message.attachmentFiles.map((attach) =>
              attach.type === "image" ? (
                <img
                  key={attach.url}
                  src={attach.url}
                  alt={attach.name}
                  width={200}
                  onClick={() => {
                    setImageData({ src: attach.url, alt: attach.name });
                    setOpenImage(true);
                  }}
                  style={{ cursor: "pointer", padding: 15 }}
                />
              ) : (
                <a
                  href={attach.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="LinkAttach"
                >
                  🔗{attach.name}
                </a>
              )
            )}
        </div>
        <span className="timeMessage">
          {displayTime(message.date, userTimeZone)}
        </span>
      </div>
    </div>
  );
}

export default MessageItem;
