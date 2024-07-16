
import './App.css';
import Chat from './Components/chat';
import Sidebar from './Components/sidebar';



function App() {
  return (
    <div className="app">
  <div className='app__body'>
        <Sidebar></Sidebar>
        <Chat></Chat>
      </div>
    </div>
    
  );
}

export default App;
