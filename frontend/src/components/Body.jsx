import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

/**
 * Chat body component that renders messages for the chosen chat.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.socket - The WebSocket connection instance.
 * @param {string} props.chosenChatID - The ID of the selected chat.
 * @param {Array} props.chosenChatMessages - List of messages for the chosen chat.
 * @returns {JSX.Element} Rendered chat messages.
 */
const Body = ({ socket, chosenChatID, chosenChatMessages }) => {
  const [messages, setMessages] = useState([]);
  const [activeDelete, setActiveDelete] = useState(null);
  const userId = localStorage.getItem("userId");
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const messagesEndRef = useRef(null);

  // Set messages when chosenChatMessages changes
  useEffect(() => {
    setMessages(chosenChatMessages);
  }, [chosenChatMessages]);

  // Scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle socket events
  useEffect(() => {
    socket.on("message", (newMessage) => {
      setMessages((prev) => {
        if (!prev.some((msg) => msg._id === newMessage._id)) {
          return [...prev, newMessage];
        }
        return prev;
      });
    });

    socket.on("deleteMessage", ({ messageId }) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    });

    return () => {
      socket.off("message");
      socket.off("deleteMessage");
    };
  }, [socket]);

  // Delete message handler
  const handleDeleteMessage = async (messageId) => {
    try {
      const response = await fetch(`${baseUrl}/api/message/${messageId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        socket.emit("deleteMessage", { messageId });
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
        setActiveDelete(null);
      } else {
        console.error("Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const toggleDeleteButton = (messageId) => {
    setActiveDelete((prevId) => (prevId === messageId ? null : messageId));
  };

  return (
    <section className="flex flex-col flex-grow h-48 lg:min-h-[57vh] bg-blue-50 dark:bg-sky-950 p-4 sm:px-6 lg:px-8 overflow-y-auto">
      <header className="font-bold text-xl text-center mb-4 text-sky-800 dark:text-sky-300"></header>
      <div className="space-y-6">
        {messages.map((msg) => (
          <MessageItem
            key={msg._id}
            message={msg}
            userId={userId}
            activeDelete={activeDelete}
            toggleDeleteButton={toggleDeleteButton}
            handleDeleteMessage={handleDeleteMessage}
            baseUrl={baseUrl}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </section>
  );
};

/**
 * MessageItem component renders individual chat messages.
 */
const MessageItem = ({
  message,
  userId,
  activeDelete,
  toggleDeleteButton,
  handleDeleteMessage,
  baseUrl,
}) => {
  const isUserMessage = message.senderId && message.senderId._id === userId;

  return (
    <div
      className={`relative flex ${
        isUserMessage ? "justify-end" : "justify-start"
      }`}>
      <div
        className={`flex-shrink-0 ${
          isUserMessage ? "order-last ml-4" : "mr-4"
        }`}>
        <img
          src={
            message.senderId && message.senderId.profilePicture
              ? `${baseUrl}${message.senderId.profilePicture}`
              : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
          }
          alt="Profile"
          width={40}
          className="rounded-full"
        />
      </div>
      <div
        className={`px-6 py-3 rounded-lg max-w-md shadow-lg ${
          isUserMessage ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
        }`}>
        <div className="flex justify-between items-center">
          <strong className="block font-semibold text-sm">
            {message.senderId ? message.senderId.username : "Deleted Account"}
          </strong>
          {isUserMessage && (
            <div className="flex space-x-3">
              <button
                onClick={() => toggleDeleteButton(message._id)}
                className={`w-6 h-6 flex items-center justify-center rounded-full ${
                  activeDelete === message._id ? "bg-red-300" : "bg-red-500"
                } text-white`}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
              {activeDelete === message._id && (
                <button
                  onClick={() => handleDeleteMessage(message._id)}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-green-500 text-white">
                  <FontAwesomeIcon icon={faCheck} />
                </button>
              )}
            </div>
          )}
        </div>
        <p className="mt-2">{message.content}</p>
        <p className="text-xs mt-2">
          {new Date(message.createdAt).toLocaleString("de-DE", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </p>
      </div>
    </div>
  );
};

export default Body;
