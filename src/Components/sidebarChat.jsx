import React, { useEffect, useState } from 'react'
import '../Styles/sideBar.css'
// import db from './firebase';
// import { Link } from 'react-router-dom';


export default function SidebarChat({addNewChat, id,name}) {
    const [imgId, setimg]=useState(1);
    const [messages, setMessages] = useState([]); 

    useEffect(()=>{
      if(id)
      {
    //     db.collection("rooms").doc(id).collection("messages").orderBy('timestamp','asc').onSnapshot((snapshot)=>(
    //       setMessages(snapshot.docs.map(doc=>doc.data()))
    //   )
    // );
      }
    },[id])

    let createChat=()=>{
        let roomName=prompt("Enter Chat Room Name, please!!..");
    //     if (roomName)
    //     {db.collection("rooms").add({
    //       name:roomName
    //     })
    //   }
    }

    useEffect(()=>{
            setimg(Math.ceil(Math.random()*8));
    },[])

  return !addNewChat? (
//    <Link to={`/rooms/${id}`}>
//        <div className="chatItemContainer">
//         <img src={require(`./img/${imgId}.jpg`)} alt=''/>
//       <div className='chatInfo'>
//             <h5> {name} </h5>
//             <p>  {messages[messages.length-1]?.message}</p>
//       </div>
//     </div>
//    </Link>
null
  ):(
    <div className='chatItemContainer' onClick={createChat}>
        <h4> ➕ Add New Chat</h4>
    </div>
  )
}

