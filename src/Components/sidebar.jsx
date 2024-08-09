import React, { useCallback, useEffect, useState } from "react";
import "../Styles/sideBar.css";
import SearchIcon from "@mui/icons-material/Search";
import app from "../config.js";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";

import { getDatabase, push, ref, set, onChildAdded } from "firebase/database";
// import { useRenderCount } from "./countRender";

function Sidebar() {
  const db = getDatabase(app);
  const dbRef = ref(db, "chatRooms");

  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState(rooms);

  // const { roomIdTest, setRoomIdTest } = useContext(RoomProvider);
  // console.log("fe = ", filteredRooms);

  const handleFliter = useCallback(
    (value) => {
      setFilteredRooms(
        rooms.filter((room) =>
          room.roomName.toLowerCase().includes(value.toLowerCase())
        )
      );
    },
    [rooms]
  );

  const handleSearch = useCallback(
    (e) => {
      console.log(e.target.value);
      handleFliter(e.target.value);
    },
    [handleFliter]
  );

  useEffect(() => {
    //listen when i create a new room
    const unsubscribe = onChildAdded(dbRef, (snapshot) => {
      setRooms((prevRooms) => {
        return [...prevRooms, snapshot.val()];
      });
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setFilteredRooms(rooms);
  }, [rooms]);

  let createRoom = () => {
    let roomName = prompt("Enter Chat Room Name, please!!..");

    if (roomName) {
      const newDomRef = push(ref(db, "chatRooms"));
      set(newDomRef, {
        roomId: 21, //already send from computam
        roomName: roomName, //already send from computam
        roomMessages: [],
        roomImage: null, //already send from computam
      })
        .then(() => {
          alert("added successfully");
        })
        .catch((e) => console.log(e));
    }

    // const newDomRef = push(ref(db, "forms"));
    //   set(newDomRef, {
    //     formId: 1, //already send from computam
    //     content: roomName, //already send from computam
    //     options: ["yes", "no"],
    //   })
    //     .then(() => {
    //       alert("added successfully");
    //     })
    //     .catch((e) => console.log(e));
    // }

    // const newDomRef = push(ref(db, "users"));
    // set(newDomRef, {
    //   userId: 2, //already send from computam
    //   userName: roomName, //already send from computam
    //   userImage:
    //     "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    //   //already send from computam
    // })
    //   .then(() => {
    //     alert("added successfully");
    //   })
    //   .catch((e) => console.log(e));
  };

  return (
    <div className="sidebar">
      <div className="sidebar__search">
        <div className="slidebar__search__container">
          <SearchIcon className="icon" />
          <input
            placeholder="Search or start new chat"
            type="text"
            onChange={handleSearch}
            style={{ outline: "none" }}
          />
        </div>
      </div>

      <div className="sidebar__chats">
        <div className="chatItemContainer" onClick={createRoom}>
          <h4> ➕ Add New Chat</h4>
        </div>

        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => {
            // console.log(room);
            return (
              // <SidebarChat
              //   key={room["roomId"]}
              //   id={room["roomId"]}
              //   name={room["roomName"]}
              // />
              <Link key={uuid()} to={`/rooms/${room["roomId"]}`}>
                <div className="chatItemContainer">
                  {/* <img src={require(`./img/${imgId}.jpg`)} alt=''/> */}
                  <div className="chatInfo">
                    <h5> {room["roomName"]} </h5>
                    {/* <p> {messages[messages.length - 1]?.message}</p> */}
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <p style={{ textAlign: "center", color: "grey" }}>
            Invalid Room Name 🙂
          </p>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
