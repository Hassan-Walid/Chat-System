import React, { useContext, useEffect, useState } from "react";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import { Menu, MenuItem, TextField } from "@mui/material";
import MoreIcon from "@mui/icons-material/MoreVert";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { RoomContext } from "../Context/room";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const SearchAppBar = ({ setMainAppBar }) => {
  const [value, setValue] = useState("");
  const { messageRefs } = useContext(RoomContext);
  //   const resultSearch = [];
  //   let indexArr = 0;

  const [resultSearch, setResultSearch] = useState([]);
  const [indexArr, setIndexArr] = useState(0);

  useEffect(() => {
    setResultSearch([]);
    setIndexArr(0);
  }, []);

  useEffect(() => {
    if (resultSearch.length > 0) {
      setIndexArr(1); // Start with the first item
      resultSearch[0].scrollIntoView({ behavior: "smooth", block: "center" });
      resultSearch[0].style.backgroundColor = "#3482ba";
      resultSearch[0].style.borderRadius = "15px";

      setTimeout(() => {
        resultSearch[0].style.backgroundColor = "transparent";
      }, 3000);
    }
  }, [resultSearch]);

  const handleUp = () => {
    console.log("index", indexArr);
    // if (indexArr < 0) {
    //   setIndexArr(0);
    // }
    if (indexArr > 1) {
      setIndexArr(indexArr - 1);
      resultSearch[indexArr - 2].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      resultSearch[indexArr - 2].style.backgroundColor = "#3482ba";
      resultSearch[indexArr - 2].style.borderRadius = "15px";

      setTimeout(() => {
        resultSearch[indexArr - 2].style.backgroundColor = "transparent";
      }, 3000);
    }

    // setIndexArr(indexArr - 1);
  };

  const handleDown = () => {
    if (indexArr < resultSearch.length) {
      setIndexArr((old) => old + 1);

      resultSearch[indexArr].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      resultSearch[indexArr].style.backgroundColor = "#3482ba";
      resultSearch[indexArr].style.borderRadius = "15px";

      setTimeout(() => {
        resultSearch[indexArr].style.backgroundColor = "transparent";
      }, 3000);
    }

    // if (indexArr >= resultSearch.length - 1) {
    //   setIndexArr(resultSearch.length - 1);
    // } else {
    //   setIndexArr(indexArr + 1);
    // }
  };

  const handleCloseSearch = () => {
    setMainAppBar(true);
  };
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      console.log("enter");
      setResultSearch([]);
      setIndexArr(0);
      console.log(value);
      messageRefs.forEach((val) => {
        console.log("text", value.innerText);
        if (val.innerText.toLowerCase().includes(value.toLowerCase())) {
          //   resultSearch.push(val);
          console.log("here", val.innerText);
          setResultSearch((old) => [...old, val]);
        }
      });
    }
  };
  //   console.log("len", messageRefs.length);
  //   messageRefs.length > 0 &&
  //     messageRefs.map((r) => {
  //       console.log("r=", r);
  //     });
  console.log("refinSearch = ", messageRefs);
  return (
    <Toolbar>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleCloseSearch}
        edge="start"
      >
        <ArrowBackIcon />
      </IconButton>
      <TextField
        id="outlined-basic"
        label="Search"
        variant="outlined"
        style={{
          borderRadius: 15,
        }}
        onKeyDown={handleSearch}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <p>
        {indexArr}/{resultSearch.length}
      </p>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleUp}
        edge="start"
      >
        <ArrowDropUpIcon />
      </IconButton>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleDown}
        edge="start"
      >
        <ArrowDropDownIcon />
      </IconButton>
    </Toolbar>
  );
};

export default SearchAppBar;
