import React, { useContext, useEffect, useRef, useState } from "react";
import "../Styles/chat.css";
import { Avatar, IconButton } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import { useParams } from "react-router";
import EmojiPicker from "emoji-picker-react";
import {
  getDatabase,
  ref,
  get,
  query,
  orderByChild,
  equalTo,
  set,
  onChildAdded,
} from "firebase/database";
import app from "../config.js";
import img from "../images/logo192.png";
function Chat({ drawer }) {
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  // const [roomId] = useContext(Room);
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentTime, setTime] = useState("");
  const db = getDatabase(app);
  const dbRef = ref(db, "chatRooms");
  const [roomDBId, setRoomDBId] = useState("");
  const [openEmoji, setOpenEmoji] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (roomId) {
      console.log(roomId);
      const roomQuery = query(dbRef, orderByChild("roomId"), equalTo(+roomId));

      get(roomQuery)
        .then((snapshot) => {
          console.log(snapshot);
          if (snapshot.exists()) {
            console.log("val =", snapshot.val());
            console.log("id=", Object.keys(snapshot.val())[0]);
            setRoomDBId(Object.keys(snapshot.val())[0]);
            const roomData = Object.values(snapshot.val())[0];
            setRoomName(roomData.roomName);
            if (roomData.messages) {
              // console.log(roomData.messages);
              setMessages(roomData.messages);
            } else {
              setMessages([]);
            }
          } else {
            console.log("false");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [roomId]);

  useEffect(() => {
    setTime(new Date());
  }, [input]);

  useEffect(() => {
    setMessages([]);
    const dbRefMessages = ref(db, `chatRooms/${roomDBId}/messages`);
    const unsubscribe = onChildAdded(dbRefMessages, (snapshot) => {
      setMessages((prevMessages) => {
        // console.log("prev", prevMessages);
        console.log("snap", snapshot.val());
        return [...prevMessages, snapshot.val()];
      });
    });
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    // Clean up the listener on unmount
    return () => unsubscribe();
  }, [roomDBId]);

  const sendMessage = async (e) => {
    // e.preventDefault();
    console.log("ads=", roomDBId);
    const dbRefMessages = ref(db, `chatRooms/${roomDBId}/messages`);
    const snapshot = await get(dbRefMessages);
    let messages = snapshot.val() || [];

    const newMessageObject = {
      content: input,
      username: "username",
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
    };
    messages.push(newMessageObject);
    // setMessages(messages);
    await set(dbRefMessages, messages);
    setInput("");
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };
  const handleEmoji = () => {
    setOpenEmoji(!openEmoji);
  };

  const handlePressEnter = (e) => {
    if (!e.shiftKey && e.key === "Enter") {
      console.log("input", input);
      sendMessage();

      console.log();
    }
  };
  return (
    <div className="chat">
      <div className="chatbody">
        {/* {console.log(typeof messages)} */}

        {messages.map((message) => (
          <div
            className={
              message.username === "username" ? "chat_message" : "chat_reciver"
            }
          >
            <Avatar
              src={img}
              style={{ marginTop: "2.3%" }}
              sx={
                ({ width: "40px" },
                message.username === "username"
                  ? { marginLeft: "10px" }
                  : { marginRight: "10px" })
              }
            ></Avatar>

            <div className="chat-section">
              <span className="usernameMessage">
                {/* {console.log("mes", message)} */}
                {message.username}
              </span>

              <div
                className="contentMessage"
                style={
                  message.username === "username"
                    ? { backgroundColor: "#9cb3d1" }
                    : { backgroundColor: "lightgrey" }
                }
              >
                <pre>{message.content}</pre>
              </div>
              <span className="timeMessage">{message.date}</span>
            </div>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>
      <div
        className="chatfooter"
        style={drawer ? { width: "80%" } : { width: "98%" }}
      >
        <IconButton onClick={handleEmoji}>
          <InsertEmoticonIcon />
        </IconButton>
        <div>
          <EmojiPicker
            open={openEmoji}
            onEmojiClick={(e) => {
              console.log("e >> ", e.emoji);
              console.log("input >>", input);
              setInput((old) => old + e.emoji);
            }}
          />
        </div>
        <form>
          <textarea
            style={{
              borderRadius: "15px",
              resize: "none",
              padding: "5px",
              display: "flex",
              flex: 1,
            }}
            rows={2}
            type="text"
            placeholder="Type a message"
            value={input}
            onChange={(event) => {
              console.log("eee", event.target.value);
              setInput(event.target.value);
            }}
            onKeyDown={handlePressEnter}
          />
        </form>

        <IconButton>
          <AttachFileIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default Chat;
