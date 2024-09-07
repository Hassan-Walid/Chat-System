import React, { useCallback, useContext, useEffect, useState } from "react";
import "../Styles/sideBar.css";
import SearchIcon from "@mui/icons-material/Search";
import app from "../config.js";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";

import { getDatabase, ref, onChildAdded, onValue } from "firebase/database";
import { RoomContext } from "../Context/room.js";
// import { useRenderCount } from "./countRender";

function Sidebar() {
  const db = getDatabase(app);
  const dbRef = ref(db, "Threads");

  const [threads, setThread] = useState([]);
  const [filteredThreads, setFilteredThreads] = useState(threads);
  const { currentUser } = useContext(RoomContext);

  // const { roomIdTest, setRoomIdTest } = useContext(RoomProvider);
  // console.log("fe = ", filteredRooms);

  const handleFliter = useCallback(
    (value) => {
      setFilteredThreads(
        threads.filter((thread) =>
          thread.threadTittle.toLowerCase().includes(value.toLowerCase())
        )
      );
    },
    [threads]
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
    // arrThreadIDs = [];
    const unsubscribe = onChildAdded(dbRef, (snapshot) => {
      // setThread((prevThreads) => {
      const threadData = snapshot.val();

      if (
        threadData.usersId.find((user) => {
          if (user === currentUser.userId) {
            return true;
          }
          return false;
        })
      ) {
        const dbRefApps = ref(db, `Apps/${threadData.ownerId}`);
        const unsubscribeApp = onValue(dbRefApps, (snapshot) => {
          const appData = snapshot.val();
          console.log("data=", { ...threadData, ...appData });
          setThread((prevThreads) => [
            ...prevThreads,
            { ...threadData, ...appData },
          ]);
        });
        return () => {
          unsubscribeApp();
        };
      }
      // });
    });

    // Clean up the listener on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log("threads=", threads);
    setFilteredThreads(threads);
  }, [threads]);

  // let createRoom = () => {
  //   let roomName = prompt("Enter Chat Room Name, please!!..");

  //   if (roomName) {
  //     const newDomRef = push(ref(db, "chatRooms"));
  //     set(newDomRef, {
  //       roomId: 21, //already send from computam
  //       roomName: roomName, //already send from computam
  //       roomMessages: [],
  //       roomImage: null, //already send from computam
  //     })
  //       .then(() => {
  //         alert("added successfully");
  //       })
  //       .catch((e) => console.log(e));
  //   }

  //   // const newDomRef = push(ref(db, "forms"));
  //   //   set(newDomRef, {
  //   //     formId: 1, //already send from computam
  //   //     content: roomName, //already send from computam
  //   //     options: ["yes", "no"],
  //   //   })
  //   //     .then(() => {
  //   //       alert("added successfully");
  //   //     })
  //   //     .catch((e) => console.log(e));
  //   // }

  //   // const newDomRef = push(ref(db, "users"));
  //   // set(newDomRef, {
  //   //   userId: 2, //already send from computam
  //   //   userName: roomName, //already send from computam
  //   //   userImage:
  //   //     "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
  //   //   //already send from computam
  //   // })
  //   //   .then(() => {
  //   //     alert("added successfully");
  //   //   })
  //   //   .catch((e) => console.log(e));
  // };
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
        {filteredThreads?.length > 0 ? (
          filteredThreads.map((thread) => {
            // console.log(room);
            return (
              // <SidebarChat
              //   key={room["roomId"]}
              //   id={room["roomId"]}
              //   name={room["roomName"]}
              // />

              <Link key={uuid()} to={`/threads/${thread.threadId}`}>
                <div className="chatItemContainer">
                  <img
                    src={thread["appImage"]}
                    alt=""
                    style={{ borderRadius: "15px" }}
                  />
                  <div className="chatInfo">
                    <h5> {thread["threadTitle"]} </h5>
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
