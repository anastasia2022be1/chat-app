
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import { useState } from 'react';
import ChatRoom from "../components/ChatRoom.jsx";

const Dashboard = () => {

  const [chats, setChats] = useState([]);


  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <Header />
      </header>

      <div className="flex flex-grow overflow-hidden">
        <aside className="bg-gray-200 w-64 p-4 border-r border-gray-300 hidden md:block">
          <Sidebar chats={chats} setChats={setChats} />
        </aside>

        <ChatRoom />
      </div>
    </div>
  );
};

export default Dashboard;
