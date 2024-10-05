import React from "react";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreIcon from "@mui/icons-material/MoreVert";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import { RoomContext } from "../Context/room";
import { get, getDatabase, ref, set } from "firebase/database";
import app from "../config";
import { useNavigate } from "react-router";

const MainAppBar = ({ open, setOpen, setMainAppBar }) => {
  // const [open, setOpen] = React.useState(false);
  const db = getDatabase(app);
  const [openDialog, setOpenDialog] = React.useState(false);
  const { roomName, threadId, currentUser, setThreadId, setRoomName } =
    React.useContext(RoomContext);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenu = (event) => {
    console.log("menu", event.currentTarget);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClickSearch = () => {
    setAnchorEl(null);
    setMainAppBar(false);
  };
  const handleClickLeave = () => {
    console.log("threadId=", threadId);
    setAnchorEl(null);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleAcceptDialog = async () => {
    try {
      const refThreadUsersId = ref(db, `Threads/${threadId}/usersId`);
      const snapshot = await get(refThreadUsersId);
      if (snapshot.exists()) {
        let usersIdArr = snapshot.val() || [];
        usersIdArr = usersIdArr.filter((id) => id !== currentUser.userId);
        await set(refThreadUsersId, usersIdArr);
        setRoomName("");
        setThreadId("");
        setOpenDialog(false);
        window.location.replace("/threads");
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <Dialog
        open={openDialog}
        // TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Are you sure to leave from thread..?"}</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDialog}>NO</Button>
          <Button onClick={handleAcceptDialog}>Yes</Button>
        </DialogActions>
      </Dialog>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{ mr: 2, ...(open && { display: "none" }) }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {roomName}
        </Typography>

        <div>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <MoreIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClickSearch}>Search</MenuItem>
            <MenuItem onClick={handleClickLeave}>Leave</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </>
  );
};

export default MainAppBar;
