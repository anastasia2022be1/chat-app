/**
 * ChatList component renders a list of chats.
 * Each list item represents a single chat, and when a chat is clicked, the `handleChatClick` function is called.
 *
 * @param {Array} chats - An array of chats to display.
 * @param {Function} handleChatClick - A function that is called when a chat is clicked. It receives the chat object as an argument.
 * @returns {JSX.Element} A list of chats with a click handler for each chat.
 */
const ChatList = ({ chats, handleChatClick }) => (
  <ul className="space-y-2">
    {chats.map((chat) => (
      <li
        key={chat._id}
        className="flex items-center py-2 px-4 bg-gray-200 rounded-lg mx-2 "
        onClick={() => handleChatClick(chat)}>
        <div className="mr-3">
          <h4>{chat._id}</h4>
        </div>
      </li>
    ))}
  </ul>
);

export default ChatList;
