import { useEffect, useState } from "react";
import socketIO from "socket.io-client";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import Body from "../components/Body.jsx";
import Message from "../components/Message.jsx";
import "./dashboard.css";

// Establishing the socket connection to the server
const socket = socketIO.connect("http://localhost:3000");

/**
 * `Dashboard` component represents the main chat dashboard, displaying a sidebar, header, body (chat messages), and message input area.
 * It establishes a connection with the server using Socket.io and manages the state for the selected chat and its messages.
 * The component also listens for new messages in a chosen chat room and updates the chat view accordingly.
 *
 * @component
 * @example
 * // Usage:
 * <Dashboard />
 *
 * @returns {JSX.Element} - A JSX element representing the dashboard layout with header, sidebar, chat body, and message input area.
 */
const Dashboard = () => {
  // State variables to store the selected chat ID and messages of the chosen chat
  const [chosenChatID, setChosenChatID] = useState(null); // Store the ID of the selected chat
  const [chosenChatMessages, setChosenChatMessages] = useState([]); // Store messages for the selected chat

  /**
   * Hook to manage the registration of the chosen chat room and listen for new messages.
   * The effect runs when the `chosenChatID` or `chosenChatMessages` change.
   * It emits a 'register' event to the server to join the selected chat room.
   *
   * @returns {void}
   */
  useEffect(() => {
    // Registering to the chat room with the chosen chat ID
    if (chosenChatID !== null) {
      socket.emit("register", {
        chatRoomId: chosenChatID, // Sending the chat room ID to the server
      });
    }
  }, [chosenChatID, chosenChatMessages]); // Runs whenever the selected chat ID or messages change

  /**
   * Handles the incoming chat message and updates the chat messages state.
   *
   * @param {Array} chatMessage - The new message(s) for the selected chat room.
   * @returns {void}
   */
  const handleChosenChatMessage = (chatMessage) => {
    setChosenChatMessages(chatMessage); // Update the messages of the chosen chat
  };

  /**
   * Sets the chosen chat room by updating the `chosenChatID` state.
   *
   * @param {string} chatId - The ID of the selected chat room.
   * @returns {void}
   */
  const handleSelectChat = (chatId) => {
    setChosenChatID(chatId); // Update the selected chat room ID
  };

  return (
    <div
      id="main-dashboard"
      className="flex flex-col justify-center pt-5 lg:p-auto lg:my-auto">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <Header />
      </header>

      <div className="flex flex-col lg:flex-row flex-grow">
        {/* Sidebar */}
        <aside className="bg-gray-200 p-4 border-gray-00">
          <Sidebar
            handleSelectChat={handleSelectChat}
            handleChosenChatMessage={handleChosenChatMessage}
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
