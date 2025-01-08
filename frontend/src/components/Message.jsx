import { useState } from "react";

// Message Component
function Message({ socket }) {
  const [message, setMessage] = useState([]);

  const handleSend = (e) => {
    e.preventDefault();

    socket.on('connect', () => {
      console.log('I connected', socket.id);

      socket.emit('message:created', ' Hello server' )
    })

    socket.on('disconnect', () => {
      console.log('Disconnected');
      
    })
    
   // with emit we send the message to the server
      // socket.emit("message", {
      //   content: message,
      //   id: `${socket.id}-${Math.random()}`,
      //   socketID: socket.id,
      // });
  }
  
  return (
    <form
      onSubmit={handleSend}
      className="flex items-center p-4 bg-input dark:bg-inputDark border-t border-blue-800 dark:border-gray-700 ">
      {/* Input Field */}
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-grow p-3 border border-blue-500  dark:border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mr-3"
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
