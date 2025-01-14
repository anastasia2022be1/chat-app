
const ChatList = ({ chats, handleChatClick }) => (
  
  <ul className="space-y-2">
    {chats.map((chat) => (
      <li
        key={chat._id}
        className="flex items-center py-2 px-4 bg-gray-200 rounded-lg mx-2 "
        onClick={() => handleChatClick(chat)}
      >
        <div className="mr-3">
          <h4>{chat._id}</h4>
        </div>
      </li>
    ))}
  </ul>
  
);

export default ChatList