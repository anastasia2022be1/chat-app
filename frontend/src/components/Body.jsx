import { useState, useEffect } from 'react';



// import PropTypes from 'prop-types';
const Body = ({ socket, chosenChatID, chosenChatMessages }) => {
  const [messages, setMessages] = useState([]);
  const userId = localStorage.getItem("userId")

  useEffect(() => {
    // Messages leeren wenn neuer Chat geklickt wird
    console.log(chosenChatMessages)
    setMessages(chosenChatMessages)

  }, [chosenChatMessages])



  useEffect(() => {
    // Add a listener for the message event
    socket.on('message', (newMessage) => {
      // Avoid adding duplicate messages
      setMessages((prevMessages) => {
        // Only add newMessage if it's not already in the array
        if (!prevMessages.some(msg => msg._id === newMessage._id)) {
          return [...prevMessages, newMessage];
        }
        return prevMessages;
      });
    });

     // Clean up the event listener on component unmount or when chat changes
     return () => {
      socket.off('message');
    };
  }, [chosenChatID, socket]); // Run when chosenChatID changes


  return (
    <section id='body' className="flex flex-col flex-grow h-48 lg:min-h-[57vh] bg-blue-50 dark:bg-sky-950 p-4 sm:px-6 lg:px-8 overflow-y-auto">
    {/* Chat Messages */}
    <header className="font-bold text-xl text-center mb-4">{chosenChatID}</header>
    <div className="space-y-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${msg.senderId._id === userId ? 'justify-end' : 'justify-start'}`}
        >
          <div>
            {
              msg.senderId.profilePicture !== "" ? <div>
                <img 
                  src={`http://localhost:3000${msg.senderId.profilePicture}`}
                  alt="Profile"
                  width={20}
                  className="rounded-full flex"  
                />
              </div> : <div>
                <img 
                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                  alt="Profile"
                  width={20}
                  className="rounded-full"  
                />
              </div>
            }
          </div>
          <div
            className={`px-4 py-2 rounded-lg max-w-md shadow-md ${msg.senderId._id === userId ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            <strong>{msg.senderId.username}</strong>
            <p>{msg.content}</p>
            <p className="text-xs">{msg.createdAt}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
  );
};

export default Body;


