import "./App.css";
import PersistentDrawerLeft from "./Components/Drawer";
import { RoomProvider } from "./Context/room";

function App() {
  return (
    <RoomProvider>
      <PersistentDrawerLeft></PersistentDrawerLeft>
    </RoomProvider>

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
