import "./App.css";
import Chat from "./Components/chat";
import Sidebar from "./Components/sidebar";
import PersistentDrawerLeft from "./Components/Drawer";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RoomProvider from "./Context/room";
import { useContext } from "react";

function App() {
  return (
    <PersistentDrawerLeft></PersistentDrawerLeft>

    // <div className="app">
    // <div className="app__body">
    /* <Router>
          <Sidebar />
          <Routes>
            <Route path="/rooms/:roomId" element={<Chat />}></Route>
            <Route path="/" element={<Chat />}></Route>
          </Routes>
        </Router> */

    /* <PersistentDrawerLeft></PersistentDrawerLeft> */
    // </div>
    // </div>
  );
}

export default App;
