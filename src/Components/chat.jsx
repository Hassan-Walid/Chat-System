import React, { useEffect, useState } from 'react'
import '../Styles/chat.css'
import { Avatar, IconButton } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
// import { useParams } from 'react-router-dom';
// import db from './firebase';
// import { useSetValue } from "./StateProvider";


function Chat() {
    const [input, setInput]=useState("");
    const [imgId, setimg]=useState(1);
    const {roomId} = 1;
    const [roomName, setRoomName]=useState("");
    const [messages, setMessages] = useState([]); 
    // const [{ user }] = useSetValue();
    const [currentTime, setTime] = useState("");

    useEffect(()=>{
        if(roomId)
        {
        //     db.collection("rooms").doc(roomId).onSnapshot((snapshot)=>
        //     setRoomName(snapshot.data().name));

        //     db.collection("rooms").doc(roomId).collection("messages").orderBy('timestamp','asc').onSnapshot((snapshot)=>(
        //         setMessages(snapshot.docs.map(doc=>doc.data()))
        //     )
        //   );
        }
    },[roomId])

    useEffect(()=>{
        setimg(Math.ceil(Math.random()*8));
    },[])

    useEffect(()=>{
        setTime(new Date())
    },[input])

    const sendMessage=(e)=>{
        e.preventDefault();
        // db.collection("rooms").doc(roomId).collection("messages").add({
        //     message: input,
        //     name: user.displayName,
        //     timestamp: currentTime,
        //   });
        setMessages([...messages,{message:input,name:"username",timestamp:new Date()}])
        setInput("");
    }

  return (
    <div className='chat'>
        <div className='chatheader'>
            {/* <img src={require(`./img/${imgId}.jpg`)} alt=''/> */}
            <div className='chatheaderinfo'>
                <h5>{roomName}</h5>
                {/* <p>Last seen at {new Date(messages[messages.length-1]?.timestamp.toDate()).toUTCString()}</p> */}
            </div>
            <div className='chatheaderright'>
                {/* <IconButton> <SearchIcon/> </IconButton> */}
                {/* <IconButton> <AttachFileIcon/>  </IconButton> */}
                {/* <IconButton> <MoreVertIcon/> </IconButton> */}
            </div>
        </div> 
        <div className='chatbody'>
            {messages.map(message=>(
                 <div className={`chat_message ${ message.name==="username" && "chat_reciver"}`}> 
                 <div style={{display:"flex", flexDirection:"row"}}>
                 <Avatar sx={{ bgcolor: "orange",marginRight:"5px",width:"40px" }}>N</Avatar>
                 <p style={{fontSize:"20px",marginTop:"1%" ,color:"white"}}> {message.name}</p>
                 </div>
                 <p style={{fontSize:"18px",margin:"1%" , color:"#F7E7DC"}}>{message.message}</p>
                 {/* <span>  {new Date(message.timestamp?.toDate()).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                    })}
              </span> */}
             </div>
            ))}
        </div> 
        <div className='chatfooter'>
            <IconButton> <InsertEmoticonIcon/> </IconButton>
            <form>
                <input type='text' placeholder='Type a message' value={input} onChange={(event)=>{setInput(event.target.value)}}/> 
                <button type='submit' onClick={sendMessage}>send</button>

            </form>
            
            
                <IconButton> <AttachFileIcon/>  </IconButton>

        </div> 
    </div>
  )
}

export default Chat
