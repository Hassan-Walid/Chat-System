import React, {
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import "../Styles/chat.css";
import {
  Avatar,
  Backdrop,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import { useParams } from "react-router";
import EmojiPicker from "emoji-picker-react";
import { v4 as uuid } from "uuid";

import {
  getDatabase,
  ref,
  get,
  set,
  onChildAdded,
  update,
} from "firebase/database";
import {
  getStorage,
  ref as refStorage,
  uploadBytes,
  getDownloadURL,
  getMetadata
} from "firebase/storage";
import app from "../config.js";

import CloseIcon from "@mui/icons-material/Close";
import { RoomContext } from "../Context/room.js";

import { format, toZonedTime } from "date-fns-tz";
import axios from "axios";

function Chat({ drawer }) {
  const [input, setInput] = useState("");
  const { threadId } = useParams();
  // const [roomId] = useContext(Room);
  // const [roomName, setRoomName] = useState("");
  const [messagesState, setMessagesState] = useState([]);

  const db = getDatabase(app);
  const storage = getStorage(app);
  const dbRef = ref(db, "Threads");
  const [openEmoji, setOpenEmoji] = useState(false);
  const [files, setFiles] = useState([]);
  const bottomRef = useRef(null);
  const textAreaRef = useRef(null);
  const [openImage, setOpenImage] = React.useState(false);
  const [imageData, setImageData] = useState(null);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const { setRoomName } = useContext(RoomContext);
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { currentUser } = useContext(RoomContext);
  const [optionsSelected, setOptionsSelected] = useState([]);

  // const [disabledForm,setDisabledForm]
  console.log("current User = ", currentUser);

  const handleAttachFile = (e) => {
    // console.log("ee=", e);
    // console.log("ref", textAreaRef);
    for (let item of e.target.files) {
      // textAreaRef.current.value += item.name + "\n";
      // console.log("target", item);
      // setFiles([...files, item]);
      setFiles((oldFiles) => [...oldFiles, item]);
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

  const handleSubmitForm = async (formId) => {
    console.log("value ==", optionsSelected);
    if (optionsSelected.length > 0) {
      const refsMessages = ref(db, `Threads/${threadId}/messages`);
      const snapshot = await get(refsMessages);
      if (snapshot.exists()) {
        let messagesArr = snapshot.val() || [];
        let messageIndex;
        messagesArr.forEach((message, index) => {
          if (message.content?.formId === formId) {
            messageIndex = index;
          }
        });

        const updates = {};
        updates[
          `Threads/${threadId}/messages/${messageIndex}/content/disable`
        ] = true;

        await update(ref(db, `/`), updates);
      }
    }
    sendMessage(
      optionsSelected.constructor.name === "Array"
        ? optionsSelected.join(",")
        : optionsSelected
    );
    setOptionsSelected([]);

    // messageContainForm.disable=true;
    // messagesArr =[...messagesArr,messageContainForm];
  };
  const refsMessages = useRef(new Map());
  const {setMessageRefs } = useContext(RoomContext);

  useEffect(() => {
    return () => {
      // Clear the messageRefs array when the component unmounts
      setMessageRefs(new Map());
    };
  }, [setMessageRefs]);

  useEffect(() => {
    const getTitleThread = async () => {
      const dbRefThread = ref(db, `Threads/${threadId}`);
      const snapshot = await get(dbRefThread);
      if (snapshot.exists()) {
        const threadData = snapshot.val();
        setRoomName(threadData.threadTittle);
      }
    };
    getTitleThread();
  }, [threadId]);

  useEffect(() => {
    // console.log("useEffect");
    refsMessages.current = new Map();
    setMessagesState([]);

    const dbRefMessages = ref(db, `Threads/${threadId}/messages`);
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
  }, [threadId]);

  //form

  const sendMessage = async (options) => {
    // e.preventDefault();

    // console.log("ads=", roomDBId);
    const dbRefMessages = ref(db, `Threads/${threadId}/messages`);
    let newMessageObject;
    let attachmentFiles = [];
    const snapshot = await get(dbRefMessages);
    let messages = snapshot.val() || [];
    console.log("messages", messages);
    if (files.length > 0) {
      // get current size from real time DB
      const refThreadConfig = ref(db, `Threads/${threadId}/configuration`);
      const snapshot = await get(refThreadConfig);
      if (snapshot.exists()) {
        let threadConfig = snapshot.val();
      try {
        for (let i = 0; i < files.length; i++) {
          console.log(files[i].name);
          let storageRef = refStorage(
            storage,
            `attachments/${files[i].name}`
          );
           getMetadata(storageRef).then(async(metaDate)=>{
            let FileSizeMB = metaDate.size/(1000*1000);
            if( threadConfig.totalFileStorageUsedMB + FileSizeMB <= threadConfig.totalFileStorageLimitMB)
            {
              // upload file in storage > code below
              await uploadBytes(storageRef, files[i]);
              const url = await getDownloadURL(storageRef);
              attachmentFiles.push({
                type: files[i].type.startsWith("image/") ? "image" : "file",
                url: url,
                name: files[i].name,
              }); 
              // update totalFileStorageUsedMB in real time DB
              const updates = {};
              updates[
                `/Threads/${threadId}/configuration/totalFileStorageUsedMB`
              ] = threadConfig.totalFileStorageUsedMB + FileSizeMB;
              await update(ref(db, `/`), updates);
            }
            // else {snack bar > The allowed files size for this thread is over, You can't send files any more!! }
          })
        }
      } catch (e) {
        console.log("error");
        console.log(e);
      }
    }
    console.log("att", attachmentFiles);
    newMessageObject = {
      // messageId: uuid(),
      attachmentFiles,
      content: options || input.trim(),
      typeContent: "text",
      sender: {
        senderName: currentUser.username,
        senderId: currentUser.userId,
        senderImage: currentUser.userImg,
        type: "user",
      }, // send form computam ???
      date: new Date().toISOString(),
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
      console.log("type of =", messages.constructor.name);
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
      newMessageObject = { ...newMessageObject, threadId };
      axios.post(
        `${process.env.REACT_APP_Chat_APP_API_URL}/messages/userSend`,
        newMessageObject
      );
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

  const handleCloseImage = () => {
    setOpenImage(false);
    setImageData(null);
  };

  const addToRefsArray = (el, key) => {
    // console.log("ref current : ", refsMessages.current);
    // console.log("refs messages : ", messageRefs);

    if (el) {
      refsMessages.current.set(key, el);
      setMessageRefs(refsMessages.current);
    }
  };

  const displayTime = (messageTime, userTimeZone) => {
    const zonedTime = toZonedTime(messageTime, userTimeZone);
    return format(zonedTime, "yyyy-MM-dd HH:mm", {
      timeZone: userTimeZone,
    });
  };

  // console.log("scrollllll = ", document.documentElement.scrollHeight);

  // console.log("refsss", refsMessages.current.length);
  // refsMessages.current.map((e) => {
  //   console.log("ref=", e);
  // });
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    if (checked) {
      // Add the item to the array if it is checked
      setOptionsSelected([...optionsSelected, name]);
    } else {
      // Remove the item from the array if it is unchecked
      setOptionsSelected(optionsSelected.filter((item) => item !== name));
    }
  };

  return (
    <Stack className="chat">
      <div className="chatbody">
        {/* {console.log(typeof messages)} */}

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message="Can't Send Empty Message"
          action={actionSnackbar}
        />
        {messagesState.map((message) => {
          return (
            <div
              ref={(el) => {
                // if (el) {
                // console.log("el", el);
                addToRefsArray(el, message.messageId);
                // }
              }}
              key={uuid()}
              className={
                message.sender.senderName === currentUser.username
                  ? "chat_message"
                  : "chat_reciver" // check username
              }
            >
              <Avatar
                src={message.sender.senderImage} // get from context user API
                style={{ marginTop: "2.3%" }}
                sx={
                  ({ width: "40px" },
                  message.sender.senderName === currentUser.username
                    ? { marginLeft: "10px" }
                    : { marginRight: "10px" })
                }
              ></Avatar>

              <div className="chat-section">
                <span className="usernameMessage">
                  {/* {console.log("mes", message)} */}
                  {message.sender.senderName}
                </span>

                <div
                  key={uuid}
                  className="contentMessage"
                  style={
                    message.senderName === currentUser.username //  username of user exist
                      ? { backgroundColor: "#9cb3d1" }
                      : { backgroundColor: "lightgrey" }
                  }
                >
                  {message.content &&
                  message.content.constructor.name === "Object" ? (
                    message.type === "radio" ? (
                      <FormControl
                        disabled={message.content.disable}
                        style={{ padding: "20px" }}
                      >
                        <FormLabel id="demo-radio-buttons-group-label">
                          {message.content.formQuestion}
                        </FormLabel>
                        <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          name="radio-buttons-group"
                          onChange={(e) => setOptionsSelected(e.target.value)}
                          value={optionsSelected}
                        >
                          {message.content.options.map((option) => (
                            <FormControlLabel
                              value={option}
                              control={<Radio />}
                              label={option}
                            />
                          ))}
                        </RadioGroup>
                        <input
                          hidden={message.content.disable}
                          onClick={() =>
                            handleSubmitForm(message?.content?.formId ?? "0")
                          }
                          type="submit"
                          style={{ borderColor: "#3482ba", cursor: "pointer" }}
                          className="LinkAttach"
                        ></input>
                      </FormControl>
                    ) : (
                      <FormControl
                        disabled={message.content.disable}
                        style={{ padding: "20px" }}
                      >
                        <FormLabel id="demo-radio-buttons-group-label">
                          {message.content.formQuestion}
                        </FormLabel>
                        <FormGroup aria-label="position">
                          {message.content.options.map((option) => (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name={option}
                                  checked={optionsSelected.includes(option)}
                                  // onChange={(e) => {
                                  //   let found = false;
                                  //   // optionsSelected.forEach((item, index) => {
                                  //   //   console.log("item", item);
                                  //   //   if (item === e.target.value) {
                                  //   //     console.log("inininininininin");
                                  //   //     optionsSelected.splice(index, 1);
                                  //   //     found = true;
                                  //   //   }
                                  //   // });
                                  //   // !found
                                  //   //   ?
                                  //   setOptionsSelected([
                                  //     ...optionsSelected,
                                  //     e.target.value,
                                  //   ]);
                                  //   // : setOptionsSelected([
                                  //   //     ...optionsSelected,
                                  //   //   ]);
                                  //   console.log("check box: ", optionsSelected);
                                  // }}
                                  onChange={handleCheckboxChange}
                                />
                              }
                              label={option}
                            />
                          ))}
                        </FormGroup>
                        <input
                          hidden={message.content.disable}
                          onClick={() =>
                            handleSubmitForm(message?.content?.formId ?? "0")
                          }
                          type="submit"
                          style={{ borderColor: "#3482ba", cursor: "pointer" }}
                          className="LinkAttach"
                        ></input>
                      </FormControl>
                    )
                  ) : (
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

                  {message.attachmentFiles?.length > 0
                    ? message.attachmentFiles.map((attach) => {
                        return attach.type === "image" ? (
                          <>
                            <img
                              key={attach.url}
                              src={attach.url}
                              alt={attach.name}
                              width={200}
                              onClick={() => {
                                setImageData({
                                  src: attach.url,
                                  alt: attach.name,
                                });
                                setOpenImage(true);
                              }}
                              style={{ cursor: "pointer", padding: 15 }}
                            ></img>
                          </>
                        ) : (
                          <>
                            <a
                              href={attach.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="LinkAttach"
                            >
                              🔗{attach.name}
                            </a>
                          </>
                        );
                      })
                    : null}
                </div>

                <span className="timeMessage">
                  {displayTime(message.date, userTimeZone)}
                </span>
              </div>
            </div>
          );
        })}

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
        className={drawer ? "chatfooterWithDrawer" : "chatfooterWithoutDrawer"}
        // style={drawer ? { width: "80%" } : { width: "98%" }}
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
        <form className="formFooter">
          <textarea
            ref={textAreaRef}
            style={{
              borderRadius: "15px",
              resize: "none",
              padding: "5px",
              display: "flex",
              // flex: 1,
              width: "95%",
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
        </form>
      </div>
    </Stack>
  );
}

export default memo(Chat);
