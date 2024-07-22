import React, { createContext, useState } from "react";

export const RoomContext = createContext();

const RoomProvider = ({ children }) => {
  const [state, setState] = useState("");

  return (
    <RoomContext.Provider value={{ state, setState }}>
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;
