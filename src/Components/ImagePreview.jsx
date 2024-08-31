import React from "react";
import { Backdrop } from "@mui/material";

function ImagePreview({ imageData, open, onClose }) {
  return (
    <Backdrop
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
      onClick={onClose}
    >
      <img
        src={imageData.src}
        alt={imageData.alt}
        width="50%"
        style={{ cursor: "pointer" }}
      />
    </Backdrop>
  );
}

export default ImagePreview;
