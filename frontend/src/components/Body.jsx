import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

const Body = ({ socket, chosenChatID, chosenChatMessages }) => {
  const [messages, setMessages] = useState([]);
  const [activeDelete, setActiveDelete] = useState(null);
  const userId = localStorage.getItem("userId");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages(chosenChatMessages);
  }, [chosenChatMessages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    socket.on("message", (newMessage) => {
      setMessages((prevMessages) => {
        if (!prevMessages.some((msg) => msg._id === newMessage._id)) {
          return [...prevMessages, newMessage];
        }
        return prevMessages;
      });
    });

    socket.on("deleteMessage", ({ messageId }) => {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== messageId)
      );
    });

    return () => {
      socket.off("message");
      socket.off("deleteMessage");
    };
  }, [socket]);

  const handleDeleteMessage = async (messageId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/message/${messageId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        socket.emit("deleteMessage", { messageId });
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg._id !== messageId)
        );
        setActiveDelete(null); // Clear the active state
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
      <header className="font-bold text-xl text-center mb-4 text-sky-800 dark:text-sky-300">
        {chosenChatID}
      </header>
      <div className="space-y-6">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`relative flex ${
              msg.senderId && msg.senderId._id === userId
                ? "justify-end"
                : "justify-start"
            }`}>
            {/* Profile Picture */}
            <div
              className={`flex-shrink-0 ${
                msg.senderId && msg.senderId._id === userId
                  ? "order-last ml-4"
                  : "mr-4"
              }`}>
              <img
                src={
                  msg.senderId && msg.senderId.profilePicture !== ""
                    ? `http://localhost:3000${msg.senderId.profilePicture}`
                    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                }
                alt="Profile"
                width={40}
                className="rounded-full"
              />
            </div>

            {/* Message Content */}
            <div
              className={`px-6 py-3 rounded-lg max-w-md shadow-lg transition-all duration-300 ease-in-out transform  ${
                msg.senderId && msg.senderId._id === userId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}>
              <div className="flex justify-between items-center">
                <strong className="block font-semibold text-sm">
                  {msg.senderId ? msg.senderId.username : "Deleted Account"}
                </strong>
                {/* Delete Button */}
                {msg.senderId && msg.senderId._id === userId && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => toggleDeleteButton(msg._id)}
                      className={`w-6 h-6 flex items-center justify-center rounded-full transition duration-300 ease-in-out transform ${
                        activeDelete === msg._id
                          ? "bg-red-300 opacity-100"
                          : "bg-red-500 opacity-30 hover:opacity-100 hover:bg-red-600"
                      } text-white`}>
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                    {activeDelete === msg._id && (
                      <button
                        onClick={() => handleDeleteMessage(msg._id)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 text-white transition duration-300 ease-in-out">
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                    )}
                  </div>
                )}
              </div>
              <p className="mt-2">{msg.content}</p>
              <p className="text-xs mt-2 ">
                {new Date(msg.createdAt).toLocaleString("de-DE", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>
        ))}
        {/* Reference for auto-scroll */}
        <div ref={messagesEndRef} />
      </div>
    </section>
  );
};

export default Body;
