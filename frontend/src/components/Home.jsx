import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "../Home.css";

/**
 * Home component represents the homepage of the application.
 * - Displays a welcome message to new users and logged-in users.
 * - Simulates a chat experience with predefined messages that appear sequentially.
 * - Provides login and registration options if the user is not authenticated.
 * - Displays a button to navigate to the chat page if the user is authenticated.
 *
 * @returns {JSX.Element} The rendered Home component with the welcome section and chat simulation.
 */
export default function Home() {
  const { authState } = useContext(AuthContext); // Using AuthContext to check user authentication state
  const [messages, setMessages] = useState([]); // State to hold chat messages

  // Simulating chat messages with a delay using useEffect
  useEffect(() => {
    // Initial message
    setMessages([{ text: "Hey there! Welcome to Talki! 🎉", fromRight: true }]);

    // Timer 1: Add a message from the left side after 1 second
    const timer1 = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "Hi! Thank you! It looks really cool. 😊",
          fromRight: false,
        },
      ]);
    }, 1000);

    // Timer 2: Add a message from the right side after 2 seconds
    const timer2 = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "Absolutely! It's fast, simple, and fun to use! 🚀",
          fromRight: true,
        },
      ]);
    }, 2000);

    // Timer 3: Add a message from the left side after 3 seconds
    const timer3 = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "Sounds amazing! I can’t wait to explore it more. 😍",
          fromRight: false,
        },
      ]);
    }, 3000);

    // Cleanup function to clear timers if component unmounts
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="max-h-screen flex flex-col items-center justify-center overflow-hidden bg-backgroundChat dark:bg-backgroundChatDark px-4 sm:px-6 lg:px-8 ">
      {/* Welcome Section */}
      <div className="text-center bg-backgroundBox dark:bg-gray-800 text-white p-6 mt-6 sm:p-8 lg:p-12 rounded-xl w-full max-w-3xl">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-title dark:text-titleDark">
          Welcome to Talki!!
        </h1>
        <p className="mt-10 text-base sm:text-lg lg:text-xl text-dark-text dark:text-dark-text">
          Your favorite place to connect and chat with friends.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          {/* Conditionally render login, register or chat buttons based on authState */}
          {!authState ? (
            <>
              <Link to="/login">
                <button className="w-full sm:w-40 px-6 py-3 bg-button text-backgroundBox rounded-lg hover:bg-blue-400 transition">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="w-full sm:w-40 px-6 py-3 bg-button text-backgroundBox rounded-lg hover:bg-blue-400 transition">
                  Join Now
                </button>
              </Link>
            </>
          ) : (
            <div className=" sm:flex-row justify-center gap-4">
              <p className="text-base sm:text-lg lg:text-xl text-dark-text dark:text-dark-text">
                Welcome back! Ready to chat?
              </p>
              <Link to="/chat">
                <button className="w-full sm:w-40 px-6 py-3 mt-5 bg-button text-backgroundBox rounded-lg hover:bg-blue-400 transition">
                  Go to Chat
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Chat Simulation */}
      <div className="chat-simulation text-center mt-12 sm:mt-16 w-full max-w-4xl px-4">
        <div className="flex flex-col space-y-6">
          {/* Render simulated messages */}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.fromRight ? "justify-end" : "justify-start"
              } items-center space-x-4`}>
              {/* Display avatar for messages from the left */}
              {!message.fromRight && (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  AB
                </div>
              )}
              <div
                className={`p-4 rounded-3xl shadow-lg ${
                  message.fromRight
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-200 text-gray-800 self-start"
                }`}>
                {message.text}
              </div>
              {/* Display avatar for messages from the right */}
              {message.fromRight && (
                <div className="w-10 h-10 rounded-full bg-blue-300 flex items-center justify-center ">
                  CD
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
