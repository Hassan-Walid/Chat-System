import React, { createContext, useState } from "react";

const RoomContext = createContext();

const RoomProvider = ({ children }) => {
  const [state, setState] = useState("hassan");
  const [roomName, setRoomName] = useState();

  return (
    <RoomContext.Provider value={{ state, setState, roomName, setRoomName }}>
      {children}
    </RoomContext.Provider>
  );
};

export { RoomContext, RoomProvider };
