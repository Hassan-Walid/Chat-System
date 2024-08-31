import React, { useRef, useState } from "react";
import { IconButton, Stack } from "@mui/material";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiPickerComponent from "./EmojiPickerComponent";

function MessageForm({
  drawer,
  files,
  setFiles,
  setOpenSnackbar,
  threadId,
  sendMessage,
  handleFileUpload,
}) {
  const [input, setInput] = useState("");
  const textAreaRef = useRef(null);
  const [openEmoji, setOpenEmoji] = useState(false);

  const handleAttachFile = (e) => {
    setFiles([]);
    for (let item of e.target.files) {
      setFiles((oldFiles) => [...oldFiles, item]);
    }
  };

  const handlePressEnter = (e) => {
    if (!e.shiftKey && e.key === "Enter") {
      sendMessage(
        input,
        files,
        setFiles,
        setOpenSnackbar,
        threadId,
        textAreaRef
      );
      setInput("");
    }
  };

  return (
    <Stack
      className={drawer ? "chatfooterWithDrawer" : "chatfooterWithoutDrawer"}
    >
      <IconButton onClick={() => setOpenEmoji(!openEmoji)}>
        <InsertEmoticonIcon />
      </IconButton>
      <EmojiPickerComponent open={openEmoji} setInput={setInput} />
      <form className="formFooter">
        <textarea
          ref={textAreaRef}
          style={{
            borderRadius: "15px",
            resize: "none",
            padding: "5px",
            display: "flex",
            width: "95%",
            wordWrap: "break-word",
          }}
          rows={2}
          placeholder="Type a message"
          value={input}
          onChange={(event) => setInput(event.target.value)}
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
    </Stack>
  );
}

export default MessageForm;
