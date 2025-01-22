// const ChatList = ({ chats, handleChatClick }) => (

//   <ul className="space-y-2">
//     {chats.map((chat) => (
//       <li
//         key={chat._id}
//         className="flex items-center py-2 px-4 bg-gray-200 rounded-lg mx-2 "
//         onClick={() => handleChatClick(chat)}
//       >
//         <div className="mr-3">
//           <h4>{chat._id}</h4>
//         </div>
//       </li>
//     ))}
//   </ul>

// );

// export default ChatList

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ChatList = ({ chats, handleChatClick, handleDeleteChat }) => (
  <ul className="space-y-2">
    {chats.map((chat) => (
      <li
        key={chat._id}
        className="flex items-center justify-between py-2 px-4 bg-gray-200 rounded-lg mx-2">
        {/* Display chat information */}
        <div onClick={() => handleChatClick(chat)}>
          <h4 className="cursor-pointer">{chat.participants.map(participant => participant.username + " ")}</h4>
        </div>

        {/* delete button */}
        <button
          className="text-red-500 text-xl font-bold hover:text-red-700 focus:outline-none"
          onClick={() => handleDeleteChat(chat._id)}>
          <FontAwesomeIcon icon="fa-solid fa-trash" />
        </button>
      </li>
    ))}
  </ul>
);

export default ChatList;


