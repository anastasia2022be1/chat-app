import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
/**
 * ChatList component displays a list of chats with options to open or delete a chat.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array} props.chats - An array of chat objects to display.
 * Each chat object should have the following structure:
 * {
 *   _id: string,             // Unique identifier for the chat
 *   participants: Array<{    // List of participants in the chat
 *     username: string,      // Username of the participant
 *   }>
 * }
 * @param {Function} props.handleChatClick - Callback function triggered when a chat is clicked.
 * Receives the chat object as a parameter.
 * @param {Function} props.handleDeleteChat - Callback function triggered when the delete button is clicked.
 * Receives the chat's ID as a parameter.
 *
 * @returns {JSX.Element} A list of chats with delete functionality.
 */
const ChatList = ({ chats, handleChatClick, handleDeleteChat }) => (
  <ul className="space-y-2">
    {chats.map((chat) => (
      <li
        key={chat._id}
        className="flex items-center justify-between py-2 px-4 bg-gray-200 rounded-lg mx-2">
        {/* Display chat information */}
        <div onClick={() => handleChatClick(chat)}>
          <h4 className="cursor-pointer">
            {chat.participants.map((participant) => participant.username + " ")}
          </h4>
        </div>

        {/* Delete button */}
        <button
          className="text-red-500 text-xl font-bold hover:text-red-700 focus:outline-none cursor-pointer"
          onClick={() => handleDeleteChat(chat._id)}>
          <FontAwesomeIcon icon="fa-solid fa-trash" />
        </button>
      </li>
    ))}
  </ul>
);

export default ChatList;
