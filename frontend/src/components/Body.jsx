import { useState, useEffect } from 'react';

const Body = ({ socket }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Listen for incoming messages
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up the event listener on component unmount
    return () => {
      socket.off('message');
    };
  }, [socket]);

  return (
    <section className="flex flex-col flex-grow bg-gray-50 p-4 overflow-y-auto">
      {/* Chat Messages */}
      <div className="space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-4 py-2 rounded-lg max-w-md shadow-md ${msg.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Body;



// const Body = ({socket}) => {

//   return (
//     <section className="flex flex-col flex-grow bg-gray-50 p-4 overflow-y-auto">
//       {/* Chat Messages */}
//       <div className="space-y-4">
//         {/* Message from the user */}
//         <div className="flex justify-end">
//           <div className="bg-blue-500 text-white px-4 py-2 rounded-lg max-w-md shadow-md">
//             Hello! How are you?
//           </div>
//         </div>

//         {/* Message from the contact */}
//         <div className="flex justify-start">
//           <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg max-w-md shadow-md">
//             I'm good, thank you! What about you?
//           </div>
//         </div>

//         {/* More messages */}
//         <div className="flex justify-end">
//           <div className="bg-blue-500 text-white px-4 py-2 rounded-lg max-w-md shadow-md">
//             I'm doing great! Thanks for asking.
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Body;
