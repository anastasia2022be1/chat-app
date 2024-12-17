import { useState } from "react";

// Message Component
function Message({socket}) {
  const [message, setMessage] = useState([])
  
  const handleSend = (e) => {
    e.preventDefault();
    // console.log({
    //   user: localStorage.getItem("username"),
    //   message,
    // });
    // if(message.trim() && localStorage.getItem('username')) {
    //   // with emit we send the message to the server

      socket.emit("message", {
        text: message,
        id: `${socket.id}-${Math.random()}`,
        socketID: socket.id
      });
    }
  return (
    <form onSubmit={handleSend} className="flex items-center p-4 bg-gray-100 border-t border-gray-300">
      {/* Input Field */}
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value) }
        className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mr-3"
      />

      {/* Send Button */}
      <button type="submit" className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
        Send
      </button>
    </form>
  );
  }

export default Message;
