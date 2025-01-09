import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import { useState } from "react";
import ChatRoom from "../components/ChatRoom.jsx";

const Dashboard = () => {
  const [chats, setChats] = useState([]);

  return (
    
      <div className="h-screen flex flex-col m-3   ">
        <div>
        {/* Header */}
        <header>
          <Header />
        </header>

        <div className="flex flex-grow flex-row ">
          {/* Sidebar */}
          <aside className="bg-gray-200 w-50 p-3 border-gray-300 ">
            <Sidebar chats={chats} setChats={setChats} />
          </aside>

          {/* ChatRoom */}
          <div className="flex flex-grow bg-white">
            <ChatRoom />
          </div>
          </div>
        </div>
      </div>
    
  );
};

export default Dashboard;