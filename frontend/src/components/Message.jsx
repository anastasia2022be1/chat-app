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
      className="flex items-center p-4 bg-input dark:bg-inputDark border-t border-blue-800 dark:border-gray-700 ">
      {/* Input Field */}
      <input
        type="text"
        placeholder="Type your message..."
        value={chosenChatID === null? "Click on a chat":message}
        onChange={(e) => setMessage(e.target.value) }
        className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mr-3"
      />

      {/* Send Button */}
      <button
        type="submit"
        className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition  w-1/6">
        Send
      </button>
    </form>
  );
}

  export default Message;
