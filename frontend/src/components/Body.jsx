// import { useState, useEffect } from 'react';

// // import PropTypes from 'prop-types';
// const Body = ({ socket, chosenChatID, chosenChatMessages }) => {
//   const [messages, setMessages] = useState([]);
//   const userId = localStorage.getItem("userId")

//   useEffect(() => {
//     // Messages leeren wenn neuer Chat geklickt wird
//     console.log(chosenChatMessages)
//     setMessages(chosenChatMessages)

//   }, [chosenChatMessages])

//   useEffect(() => {
//     // Add a listener for the message event
//     socket.on('message', (newMessage) => {
//       // Avoid adding duplicate messages
//       setMessages((prevMessages) => {
//         // Only add newMessage if it's not already in the array
//         if (!prevMessages.some(msg => msg._id === newMessage._id)) {
//           return [...prevMessages, newMessage];
//         }
//         return prevMessages;
//       });
//     });

//      // Clean up the event listener on component unmount or when chat changes
//      return () => {
//       socket.off('message');
//     };
//   }, [chosenChatID, socket]); // Run when chosenChatID changes

//   return (
//     <section className="flex flex-col flex-grow h-48 lg:min-h-[57vh] bg-blue-50 dark:bg-sky-950 p-4 sm:px-6 lg:px-8 overflow-y-auto">
//     {/* Chat Messages */}
//     <header className="font-bold text-xl text-center mb-4">{chosenChatID}</header>
//     <div className="space-y-4">
//       {messages.map((msg, index) => (
//         <div
//           key={index}
//           className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
//         >
//           <div
//             className={`px-4 py-2 rounded-lg max-w-md shadow-md ${msg.senderId === userId ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
//           >
//             {msg.content}
//           </div>
//         </div>
//       ))}
//     </div>
//   </section>
//   );
// };

// export default Body;

import { useState, useEffect } from "react";

const Body = ({ socket, chosenChatID, chosenChatMessages }) => {
  const [messages, setMessages] = useState([]);
  const userId = localStorage.getItem("userId");

  // Update the messages when the chosen chat changes
  useEffect(() => {
    setMessages(chosenChatMessages);
  }, [chosenChatMessages]);

  // Listen for new incoming messages or message delete events
  useEffect(() => {
    socket.on("message", (newMessage) => {
      setMessages((prevMessages) => {
        if (!prevMessages.some((msg) => msg._id === newMessage._id)) {
          return [...prevMessages, newMessage];
        }
        return prevMessages;
      });
    });

    socket.on("deleteMessage", ({ messageId }) => {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== messageId)
      );
    });

    return () => {
      socket.off("message");
      socket.off("deleteMessage");
    };
  }, [chosenChatID, socket]);

  // Handle message deletion
  const handleDeleteMessage = async (messageId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/message/${messageId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Emit the delete message event to other clients
        socket.emit("deleteMessage", { messageId });

        // Remove the message from the state
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg._id !== messageId)
        );
      } else {
        console.error("Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };
  return (
    <section className="flex flex-col flex-grow h-48 lg:min-h-[57vh] bg-blue-50 dark:bg-sky-950 p-4 sm:px-6 lg:px-8 overflow-y-auto">
      <header className="font-bold text-xl text-center mb-4">
        {chosenChatID}
      </header>
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${
              msg.senderId === userId ? "justify-end" : "justify-start"
            } group`}>
            <div
              className={`relative px-7 py-3 rounded-lg max-w-md shadow-md ${
                msg.senderId === userId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}>
              {msg.content}
              {msg.senderId === userId && (
                <button
                  onClick={() => handleDeleteMessage(msg._id)}
                  className="absolute top-3 right-0 w-6 h-6  flex items-center justify-center bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                  <span className="text-xl font-bold">×</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Body;
