import React, { createContext, useState } from "react";

const RoomContext = createContext();

const RoomProvider = ({ children }) => {
  const [state, setState] = useState("hassan");
  const [roomName, setRoomName] = useState();
  const [messageRefs, setMessageRefs] = useState(new Map());
  const [currentUser, setCurrentUser] = useState({
    username: "yehia",
    userId: "1",
    userImg:
      "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
  });

  // const [currentUser, setCurrentUser] = useState({
  //   username: "hassan",
  //   userId: "2",
  //   userImg:
  //     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ718nztPNJfCbDJjZG8fOkejBnBAeQw5eAUA&s",
  // });
  return (
    <RoomContext.Provider
      value={{
        state,
        setState,
        roomName,
        setRoomName,
        messageRefs,
        setMessageRefs,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export { RoomContext, RoomProvider };
