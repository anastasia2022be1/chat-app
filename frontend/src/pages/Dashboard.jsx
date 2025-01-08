import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import { useState } from "react";
import ChatRoom from "../components/ChatRoom.jsx";

const Dashboard = () => {
  const [chats, setChats] = useState([]);

  return (
    <div className="p-4 mt-2  flex flex-col h-screen">
      {/* Header */}
      <header>
        <Header />
      </header>

      <div className="flex flex-grow ">
        <aside className="bg-gray-200 w-50 p-4  border-gray-300  ">
          <Sidebar chats={chats} setChats={setChats} />
        </aside>

        <ChatRoom />
      </div>
    </div>
  );
};

export default Dashboard;