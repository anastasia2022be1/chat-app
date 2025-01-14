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

// import { useEffect, useState } from 'react';
// import socketIO from 'socket.io-client';
// import Sidebar from '../components/Sidebar.jsx';
// import Header from '../components/Header.jsx';
// import Body from '../components/Body.jsx';
// import Message from '../components/Message.jsx';

// const socket = socketIO.connect('http://localhost:3000');

// const Dashboard = () => {
//   const [chats, setChats] = useState([]);
//   const [chosenChatID, setChosenChatID] = useState(null);
 



//   useEffect(() => {
//     if (chosenChatID !== null) {
//       socket.emit("register", {
//         chatRoomId: chosenChatID
//       })
//     }
//   }, [chosenChatID])
  
//   const handleSelectChat = (chatId) => {
//     setChosenChatID(chatId);
//   };

  

//   return (
//     <div className="p-10 mt-2  flex flex-col h-full ">
//       {/* Header */}
//       <header className="bg-white shadow-md sticky top-0 z-10">
//         <Header />
//       </header>

//       <div className="flex flex-grow ">
//         {/* Sidebar */}
//         <aside className="bg-gray-200 w-50 p-4  border-gray-300 hidden lg:block  ">
//           <Sidebar chats={chats} handleSelectChat={handleSelectChat} />
//         </aside>

//         {/* Main Content */}
//         <div className="flex flex-col flex-grow">
//           {/* Chat Display Area */}
//           <div className="flex-grow bg-gray-50 overflow-y-auto p-4">
//             <Body socket={socket} chosenChatID={chosenChatID} />
//           </div>

//           {/* Message Input */}
//           <footer className="bg-white border-t border-gray-200 p-4">
//             <Message socket={socket} chosenChatID={chosenChatID} />
//           </footer>
//         </div>
//       </div>
//     </div>
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
  const [chosenChatID, setChosenChatID] = useState(null);
  const [chosenChatMessages, setChosenChatMessages] = useState([]);
  useEffect(() => {
    console.log("current chatmessages in dashboard : " + chosenChatMessages)
  
    if (chosenChatID !== null) {
      socket.emit("register", {
        chatRoomId: chosenChatID,
      });
    }

  }, [chosenChatID])


  
  const handleSelectChat = (chatId) => {
    setChosenChatID(chatId);
  };

  return (
    <div className="max-h-screen flex flex-col  justify-center pt-5  lg:p-auto  lg:my-auto ">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <Header />
      </header>

      <div className="flex flex-col lg:flex-row flex-grow   ">
        {/* Sidebar */}
        <aside className="bg-gray-200 p-4 border-gray-00  ">
          <Sidebar 
          handleSelectChat={handleSelectChat} 
          chosenChatID={chosenChatID}
          setChosenChatMessages={setChosenChatMessages}
          />
        </aside>

        {/* Main Content */}
        <div className="flex flex-col flex-grow">
          {/* Chat Display Area */}
          <div className="flex-grow bg-gray-50 overflow-y-auto p-4">
            <Body socket={socket} 
            chosenChatID={chosenChatID}
            chosenChatMessages={chosenChatMessages}
            />
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





