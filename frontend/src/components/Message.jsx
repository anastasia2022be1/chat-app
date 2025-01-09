import { useState } from "react";

// Message Component
function Message({ socket }) {
  const [message, setMessage] = useState([]);

  const handleSend = (e) => {
    e.preventDefault();

    // with emit we send the message to the server
    socket.emit("message", {
      content: message,
      id: `${socket.id}-${Math.random()}`,
      socketID: socket.id,
    });
  };

  return (
    <form
      onSubmit={handleSend}
      className="flex flex-col md:flex-row items-center p-4 bg-input dark:bg-inputDark border-t border-blue-800 dark:border-gray-700 gap-3">
      {/* Input Field */}
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-grow w-full md:w-auto p-3 border border-blue-500 dark:border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Send Button */}
      <button
        type="submit"
        className="p-3 w-full md:w-1/6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
        Send
      </button>
    </form>
  );
}

export default Message;
