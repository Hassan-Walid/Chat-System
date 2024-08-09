import React, { createContext, useState } from "react";

const RoomContext = createContext();

const RoomProvider = ({ children }) => {
  const [state, setState] = useState("hassan");
  const [roomName, setRoomName] = useState();
  const [messageRefs, setMessageRefs] = useState(new Map());

  return (
    <RoomContext.Provider
      value={{
        state,
        setState,
        roomName,
        setRoomName,
        messageRefs,
        setMessageRefs,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export { RoomContext, RoomProvider };
