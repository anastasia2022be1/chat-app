import { useState } from "react";

// Message Component
function Message({socket, chosenChatID}) {
  const [message, setMessage] = useState("")

  const userId = localStorage.getItem("userId")

  const handleSend = (e) => {
    e.preventDefault();
      socket.emit("message", {
        chatId: chosenChatID,
        senderId: userId,
        content: message,
      });
      setMessage(""); // Clear the input field after sending the message

  };
  return (
    <form
      onSubmit={handleSend}
      className="flex flex-col md:flex-row items-center p-4 bg-input dark:bg-inputDark border-t border-blue-800 dark:border-gray-700 gap-3"
    >
      {/* Input Field */}
      <input
        type="text"
        placeholder={chosenChatID === null ? "Click on a chat to start messaging" : "Type your message..."}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-grow w-full md:w-auto p-3 border border-blue-500 dark:border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={chosenChatID === null} // Disable input if no chat is selected
      />

      {/* Send Button */}
      <button
        type="submit"

        className={`p-3 w-full md:w-1/6 rounded-lg transition ${
          chosenChatID === null
            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        Send
      </button>
    </form>
  );

}

export default Message;

