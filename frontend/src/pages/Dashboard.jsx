import { useEffect, useState } from "react";
import socketIO from "socket.io-client";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import Body from "../components/Body.jsx";
import Message from "../components/Message.jsx";

// Initialize the Socket.IO connection
const socket = socketIO.connect("http://localhost:3000");

const Dashboard = () => {
  const [chosenChatID, setChosenChatID] = useState(null); // to store the ID of the currently selected chat
  const [chosenChatMessages, setChosenChatMessages] = useState([]); // to store the messages of the currently selected chat

  // handle actions when the selected chat changes
  useEffect(() => {
    console.log("current chatmessages in dashboard : " + chosenChatMessages);

    // // If a chat is selected, register the chatRoomId with the server
    if (chosenChatID !== null) {
      socket.emit("register", {
        chatRoomId: chosenChatID,
      });
    }
  }, [chosenChatID]); // Runs whenever chosenChatID changes

  // Function to handle chat selection from the sidebar
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
            <Body
              socket={socket}
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
