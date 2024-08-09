import React from "react";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import { Menu, MenuItem } from "@mui/material";
import MoreIcon from "@mui/icons-material/MoreVert";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import { RoomContext } from "../Context/room";

const MainAppBar = ({ open, setOpen, setMainAppBar }) => {
  // const [open, setOpen] = React.useState(false);
  const { roomName } = React.useContext(RoomContext);

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

  return (
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
        </Menu>
      </div>
    </Toolbar>
  );
};

export default MainAppBar;
