import React, { createContext, useState } from "react";

const RoomContext = createContext();

const RoomProvider = ({ children }) => {
  const [roomName, setRoomName] = useState("");
  const [threadId, setThreadId] = useState("");
  const [messageRefs, setMessageRefs] = useState(new Map());

  // const [currentUser, setCurrentUser] = useState({
  //   userName: "yehia",
  //   userId: "1",
  //   userImage:
  //     "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
  // });

  const [currentUser, setCurrentUser] = useState({
    userName: "hassan",
    userId: "2",
    userImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ718nztPNJfCbDJjZG8fOkejBnBAeQw5eAUA&s",
  });
  // /*const [currentUser, setCurrentUser] = useState({
  //    userName: "khaled",
  //    userId: "3",
  //    userImage:
  //      "https://img.freepik.com/free-photo/abstract-autumn-beauty-multi-colored-leaf-vein-pattern-generated-by-ai_188544-9871.jpg?w=1380&t=st=1725732604~exp=1725733204~hmac=1b0926870d7ca97a1fa89387521abadd6e853be5cfd2af8abb95146bdacecad5",
  //  });*/

  // const [currentUser, setCurrentUser] = useState({
  //   userName: "newUser",
  //   userId: "5",
  //   userImage:
  //     "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
  // });
  return (
    <RoomContext.Provider
      value={{
        threadId,
        setThreadId,
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
