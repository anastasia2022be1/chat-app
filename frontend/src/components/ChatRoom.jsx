import socketIO from "socket.io-client";
import Body from "./Body.jsx";
import Message from "./Message.jsx";

// Initializing Socket.IO
const socket = socketIO.connect("http://localhost:3000");

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
  return (
    <section className="flex flex-col flex-grow   ">
      <div className="flex-grow overflow-y-auto">
        <Body socket={socket} />
      </div>
      <div className="bg-white border-t border-gray-300">
        <Message socket={socket} />
      </div>
    </section>
  );
};

export default ChatRoom;
