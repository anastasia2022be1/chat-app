// import { useState, useEffect } from "react";

// const Body = ({ socket, chosenChatID, chosenChatMessages }) => {
//   const [messages, setMessages] = useState([]);
//   const userId = localStorage.getItem("userId");

//   // Update the messages when the chosen chat changes
//   useEffect(() => {
//     setMessages(chosenChatMessages);
//   }, [chosenChatMessages]);

//   // Listen for new incoming messages or message delete events
//   useEffect(() => {
//     socket.on("message", (newMessage) => {
//       setMessages((prevMessages) => {
//         if (!prevMessages.some((msg) => msg._id === newMessage._id)) {
//           return [...prevMessages, newMessage];
//         }
//         return prevMessages;
//       });
//     });

//     socket.on("deleteMessage", ({ messageId }) => {
//       setMessages((prevMessages) =>
//         prevMessages.filter((msg) => msg._id !== messageId)
//       );
//     });

//     return () => {
//       socket.off("message");
//       socket.off("deleteMessage");
//     };
//   }, [chosenChatID, socket]);

//   // Handle message deletion
//   const handleDeleteMessage = async (messageId) => {
//     console.log(messageId);
//     try {
//       const response = await fetch(
//         `http://localhost:3000/api/message/${messageId}`,
//         {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.ok) {
//         // Emit the delete message event to other clients
//         socket.emit("deleteMessage", { messageId });

//         // Remove the message from the state
//         setMessages((prevMessages) =>
//           prevMessages.filter((msg) => msg._id !== messageId)
//         );
//       } else {
//         console.error("Failed to delete message");
//       }
//     } catch (error) {
//       console.error("Error deleting message:", error);
//     }
//   };
//   return (
//     <section className="flex flex-col flex-grow h-48 lg:min-h-[57vh] bg-blue-50 dark:bg-sky-950 p-4 sm:px-6 lg:px-8 overflow-y-auto">
//       <header className="font-bold text-xl text-center mb-4">
//         {chosenChatID}
//       </header>
//       <div className="space-y-4">
//         {messages.map((msg) => (
//           <div
//             key={msg._id}
//             className={`flex ${
//               msg.senderId && msg.senderId._id === userId
//                 ? "justify-end"
//                 : "justify-start"
//             } group`}>
//             {/* Profile Picture */}
//             <div
//               className={`flex-shrink-0 ${
//                 msg.senderId && msg.senderId._id === userId
//                   ? "order-last ml-2"
//                   : "mr-2"
//               }`}>
//               {msg.senderId && msg.senderId.profilePicture !== "" ? (
//                 <img
//                   src={`http://localhost:3000${msg.senderId.profilePicture}`}
//                   alt="Profile"
//                   width={40}
//                   className="rounded-full"
//                 />
//               ) : (
//                 <img
//                   src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
//                   alt="Profile"
//                   width={40}
//                   className="rounded-full"
//                 />
//               )}
//             </div>

//             {/* Message */}
//             <div
//               className={`relative px-4 py-2 rounded-lg max-w-md shadow-md ${
//                 msg.senderId && msg.senderId._id === userId
//                   ? "bg-blue-500 text-white "
//                   : "bg-gray-200 text-gray-800"
//               }`}>
//               <strong className="block">
//                 {msg.senderId ? msg.senderId.username : "Deleted Account"}
//               </strong>
//               <p>{msg.content}</p>
//               <p className="text-xs mt-1">{msg.createdAt}</p>
//               {msg.senderId && msg.senderId._id === userId && (
//                 <button
//                   onClick={() => handleDeleteMessage(msg._id)}
//                   className="absolute top-0 right-0 w-6 h-6  flex items-center justify-center bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
//                   <span className="text-xl font-bold">×</span>
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default Body;

import { useState, useEffect, useRef } from "react";

const Body = ({ socket, chosenChatID, chosenChatMessages }) => {
  const [messages, setMessages] = useState([]);
  const userId = localStorage.getItem("userId");

  // Reference to the end of the messages container for auto-scrolling
  const messagesEndRef = useRef(null);

  // Update messages when the selected chat changes
  useEffect(() => {
    setMessages(chosenChatMessages);
  }, [chosenChatMessages]);

  // Scroll to the bottom when the messages array changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Listen for new incoming messages or message delete events
  useEffect(() => {
    socket.on("message", (newMessage) => {
      setMessages((prevMessages) => {
        // Only add the message if it isn't already in the list
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
    console.log(messageId);
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
              msg.senderId && msg.senderId._id === userId
                ? "justify-end"
                : "justify-start"
            } group`}>
            {/* Profile Picture */}
            <div
              className={`flex-shrink-0 ${
                msg.senderId && msg.senderId._id === userId
                  ? "order-last ml-2"
                  : "mr-2"
              }`}>
              {msg.senderId && msg.senderId.profilePicture !== "" ? (
                <img
                  src={`http://localhost:3000${msg.senderId.profilePicture}`}
                  alt="Profile"
                  width={40}
                  className="rounded-full"
                />
              ) : (
                <img
                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                  alt="Profile"
                  width={40}
                  className="rounded-full"
                />
              )}
            </div>

            {/* Message */}
            <div
              className={`relative px-4 py-2 rounded-lg max-w-md shadow-md ${
                msg.senderId && msg.senderId._id === userId
                  ? "bg-blue-500 text-white "
                  : "bg-gray-200 text-gray-800"
              }`}>
              <strong className="block">
                {msg.senderId ? msg.senderId.username : "Deleted Account"}
              </strong>
              <p>{msg.content}</p>
              <p className="text-xs mt-1">
                {new Date(msg.createdAt).toLocaleString("de-DE", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </p>
              {msg.senderId && msg.senderId._id === userId && (
                <button
                  onClick={() => handleDeleteMessage(msg._id)}
                  className="absolute top-0 right-0 w-6 h-6  flex items-center justify-center bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                  <span className="text-xl font-bold">×</span>
                </button>
              )}
            </div>
          </div>
        ))}
        {/* Reference to the end of the messages container for scrolling */}
        <div ref={messagesEndRef} />
      </div>
    </section>
  );
};

export default Body;
