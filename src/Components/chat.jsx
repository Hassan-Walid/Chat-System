import React, { useContext, useEffect, useRef, useState } from "react";
import "../Styles/chat.css";
import { Avatar, Backdrop, Chip, IconButton, Snackbar } from "@mui/material";
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
import {
  getStorage,
  ref as refStorage,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import app from "../config.js";
import img from "../images/logo192.png";
import CloseIcon from "@mui/icons-material/Close";
function Chat({ drawer }) {
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  // const [roomId] = useContext(Room);
  const [roomName, setRoomName] = useState("");
  const [messagesState, setMessagesState] = useState([]);
  const [currentTime, setTime] = useState("");
  const db = getDatabase(app);
  const storage = getStorage(app);
  const dbRef = ref(db, "chatRooms");
  const [roomDBId, setRoomDBId] = useState("");
  const [openEmoji, setOpenEmoji] = useState(false);
  const [files, setFiles] = useState([]);
  const bottomRef = useRef(null);
  const textAreaRef = useRef(null);
  const [openImage, setOpenImage] = React.useState(false);
  const [imageData, setImageData] = useState(null);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const handleAttachFile = (e) => {
    // console.log("ee=", e);
    // console.log("ref", textAreaRef);
    for (let item of e.target.files) {
      textAreaRef.current.value += item.name + "\n";
      setFiles([...files, item]);
      // console.log("item", item.name);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  const handleDeleteFile = () => {
    setFiles([]);
  };

  const actionSnackbar = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackbar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  useEffect(() => {
    if (roomId) {
      setFiles([]);
      // console.log(roomId);
      const roomQuery = query(dbRef, orderByChild("roomId"), equalTo(+roomId));

      get(roomQuery)
        .then((snapshot) => {
          // console.log(snapshot);
          if (snapshot.exists()) {
            // console.log("val =", snapshot.val());
            // console.log("id=", Object.keys(snapshot.val())[0]);
            setRoomDBId(Object.keys(snapshot.val())[0]);
            const roomData = Object.values(snapshot.val())[0];
            setRoomName(roomData.roomName);
            if (roomData.messages) {
              // console.log(roomData.messages);
              setMessagesState(roomData.messages);
            } else {
              setMessagesState([]);
            }
          } else {
            // console.log("false");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [roomId]);

  useEffect(() => {
    setMessagesState([]);
    const dbRefMessages = ref(db, `chatRooms/${roomDBId}/messages`);
    const unsubscribe = onChildAdded(dbRefMessages, (snapshot) => {
      setMessagesState((prevMessages) => {
        // console.log("prev", prevMessages);
        // console.log("snap", snapshot.val());
        return [...prevMessages, snapshot.val()];
      });
    });
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    // Clean up the listener on unmount
    return () => unsubscribe();
  }, [roomDBId]);

  const sendMessage = async (e) => {
    // e.preventDefault();

    // console.log("ads=", roomDBId);
    const dbRefMessages = ref(db, `chatRooms/${roomDBId}/messages`);
    let newMessageObject;
    let attachmentFiles;
    const snapshot = await get(dbRefMessages);
    let messages = snapshot.val() || [];
    if (files.length > 0) {
      // add attachment obj to msg
      try {
        const storageRef = refStorage(storage, `attachments/${files[0].name}`);

        await uploadBytes(storageRef, files[0]);

        const url = await getDownloadURL(storageRef);

        attachmentFiles = {
          type: files[0].type.startsWith("image/") ? "image" : "file",
          url: url,
          name: files[0].name,
        };

        // newMessageObject = {
        //   content: {
        //     type: files[0].type.startsWith("image/") ? "image" : "file",
        //     url: url,
        //     name: files[0].name,
        //   },
        //   username: "username",
        //   date: new Date().toLocaleString("en-US", {
        //     month: "short",
        //     day: "numeric",
        //     year: "numeric",
        //     hour: "numeric",
        //     minute: "numeric",
        //     hour12: true,
        //   }),
        // };
      } catch (e) {
        console.log("error");
        console.log(e);
      }
    }

    newMessageObject = {
      attachmentFiles,
      content: input.trim(),
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

    if (!newMessageObject.content && files.length > 0) {
      //send att only
      console.log("1st cond");
      // console.log(files.length);

      delete newMessageObject.content;
    }
    if (newMessageObject.content?.length && files.length === 0) {
      //send content only
      delete newMessageObject.attachmentFiles;
    }

    if (!newMessageObject.content?.length && files.length === 0) {
      // no send content and att
      setOpenSnackbar(true);
    } else {
      messages.push(newMessageObject);
      await set(dbRefMessages, messages);
      setInput("");
      setFiles([]);
      textAreaRef.current.value = "";
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
      setMessagesState(messages);
    }
  };
  const handleEmoji = () => {
    setOpenEmoji(!openEmoji);
  };

  const handlePressEnter = (e) => {
    if (!e.shiftKey && e.key === "Enter") {
      // console.log("input", input);
      sendMessage();
    }
  };
  const handleOpenImage = () => {
    setOpenImage(true);
  };
  const handleCloseImage = () => {
    setOpenImage(false);
    setImageData(null);
  };
  // console.log("scrollllll = ", document.documentElement.scrollHeight);
  return (
    <div className="chat">
      <div className="chatbody">
        {/* {console.log(typeof messages)} */}

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message="Can't Send Empty Message"
          action={actionSnackbar}
        />
        {messagesState.map((message) => (
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
                {message.content && (
                  <pre
                    style={{
                      whiteSpace: "pre-wrap",

                      wordWrap: "break-word",
                      maxWidth: "40rem",
                    }}
                  >
                    {message.content}
                  </pre>
                )}

                {message.attachmentFiles ? (
                  message.attachmentFiles.type === "image" ? (
                    <>
                      <img
                        src={message.attachmentFiles.url}
                        alt={message.attachmentFiles.name}
                        width={200}
                        onClick={() => {
                          setImageData({
                            src: message.attachmentFiles.url,
                            alt: message.attachmentFiles.name,
                          });
                          setOpenImage(true);
                        }}
                        style={{ cursor: "pointer", padding: 15 }}
                      ></img>
                    </>
                  ) : (
                    <>
                      <a
                        href={message.attachmentFiles.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {message.attachmentFiles.name}
                      </a>
                    </>
                  )
                ) : null}
              </div>
              <span className="timeMessage">{message.date}</span>
            </div>
          </div>
        ))}
        {imageData && (
          <Backdrop
            sx={{
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={openImage}
            onClick={handleCloseImage}
          >
            {/* {console.log("img", message.attachmentFiles.url)} */}
            <img
              src={imageData.src}
              alt={imageData.alt}
              width="50%"
              style={{ cursor: "pointer" }}
            />
          </Backdrop>
        )}

        {files.length ? (
          <Chip
            label={`${files.length} attachments files`}
            variant="outlined"
            // onClick={handleClickFile}
            onDelete={handleDeleteFile}
            sx={{
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            style={{
              marginBottom: "4%",
              position: "fixed",
              bottom: "0",
              // top: document.documentElement.scrollHeight - 100,
              left: "55%",
            }}
          />
        ) : null}
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
              // console.log("e >> ", e.emoji);
              // console.log("input >>", input);
              setInput((old) => old + e.emoji);
            }}
          />
        </div>
        <form>
          <textarea
            ref={textAreaRef}
            style={{
              borderRadius: "15px",
              resize: "none",
              padding: "5px",
              display: "flex",
              flex: 1,
              wordWrap: "break-word",
            }}
            rows={2}
            type="text"
            placeholder="Type a message"
            value={input}
            onChange={(event) => {
              // console.log("eee", event.target.value);
              setInput(event.target.value);
            }}
            onKeyDown={handlePressEnter}
          />
        </form>
        <IconButton>
          <label htmlFor="fileUpload" style={{ cursor: "pointer" }}>
            <AttachFileIcon />
          </label>
        </IconButton>
        <input
          type="file"
          id="fileUpload"
          style={{ display: "none" }}
          onChange={handleAttachFile}
          multiple
        />
      </div>
    </div>
  );
}

export default Chat;
