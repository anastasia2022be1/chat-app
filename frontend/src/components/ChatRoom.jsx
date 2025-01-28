import socketIO from "socket.io-client";
import Body from "./Body.jsx";
import Message from "./Message.jsx";

const socket = socketIO.connect(
  import.meta.env.VITE_API_URL || "http://localhost:3000"
);

/**
 * ChatRoom component renders a chat room structure with two main sections:
 * - The Body component for displaying chat messages and handling new incoming messages.
 * - The Message component for inputting and sending new messages.
 *
 * The component establishes a Socket.IO connection to the server for real-time messaging.
 *
 * @returns {JSX.Element} The rendered chat room structure with two components: Body and Message.
 */
const ChatRoom = () => {
  // Handle socket connection errors
  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  return (
    <section className="flex flex-col flex-grow h-screen">
      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto">
        <Body socket={socket} />
      </div>
      {/* Message Input */}
      <div className="bg-white border-t border-gray-300">
        <Message socket={socket} />
      </div>
    </section>
  );
};

export default ChatRoom;
