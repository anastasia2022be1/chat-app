// import Sidebar from "../components/Sidebar.jsx";
// import Header from "../components/Header.jsx";
// import { useState } from "react";
// import ChatRoom from "../components/ChatRoom.jsx";

// const Dashboard = () => {
//   const [chats, setChats] = useState([]);
//   const [chosenChatID, setChosenChatID] = useState(null)

//   const handleSelectChat = (chatId) => {
//     setChosenChatID(chatId);
//   };
//   return (
    
//       <div className="h-screen flex flex-col m-3   ">
//         <div>
//         {/* Header */}
//         <header>
//           <Header />
//         </header>

//         <div className="flex flex-grow flex-row ">
//           {/* Sidebar */}
//           <aside className="bg-gray-200 w-50 p-3 border-gray-300 ">
//             <Sidebar handleSelectChat={handleSelectChat} />
//           </aside>

//           {/* ChatRoom */}
//           <div className="flex flex-grow bg-white">
//             <ChatRoom />
//           </div>
//           </div>
//         </div>
//       </div>
    
//   );
// };

// export default Dashboard;

import { useEffect, useState } from 'react';
import socketIO from 'socket.io-client';
import Sidebar from '../components/Sidebar.jsx';
import Header from '../components/Header.jsx';
import Body from '../components/Body.jsx';
import Message from '../components/Message.jsx';

const socket = socketIO.connect('http://localhost:3000');

const Dashboard = () => {
  const [chats, setChats] = useState([]);
  const [chosenChatID, setChosenChatID] = useState(null);
  useEffect(() => {
    if (chosenChatID !== null) {
      socket.emit("register", {
        chatRoomId: chosenChatID
      })
    }
  }, [chosenChatID])
  
  const handleSelectChat = (chatId) => {
    setChosenChatID(chatId);
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <Header />
      </header>

      <div className="flex flex-grow flex-row">
        {/* Sidebar */}
        <aside className="bg-gray-100 w-64 p-4 border-r border-gray-200 hidden md:block">
          <Sidebar chats={chats} handleSelectChat={handleSelectChat} />
        </aside>

        {/* Main Content */}
        <div className="flex flex-col flex-grow">
          {/* Chat Display Area */}
          <div className="flex-grow bg-gray-50 overflow-y-auto p-4">
            <Body socket={socket} chosenChatID={chosenChatID} />
          </div>

          {/* Message Input */}
          <footer className="bg-white border-t border-gray-200 p-4">
            <Message socket={socket} chosenChatID={chosenChatID} />
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;




