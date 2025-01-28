import { useState } from "react";
import EmojiPicker from "emoji-picker-react";

/**
 * Message component allows users to send messages in a chat.
 * - Provides an input field for typing a message.
 * - Displays an emoji picker to add emojis to the message.
 * - Sends the message via the socket connection to the server.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.socket - The socket instance used to send messages.
 * @param {string|null} props.chosenChatID - The ID of the currently selected chat.
 * @returns {JSX.Element} The rendered message input and send button components.
 */
function Message({ socket, chosenChatID }) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const userId = localStorage.getItem("userId");

  /**
   * handleEmojiSelect function is triggered when a user selects an emoji from the emoji picker.
   * It appends the selected emoji to the message input and hides the emoji picker.
   *
   * @param {Object} emoji - The emoji object selected by the user.
   * @param {string} emoji.emoji - The emoji character selected.
   */
  const handleEmojiSelect = (emoji) => {
    setMessage(message + emoji.emoji);
    setShowEmojiPicker(false); // Hide the picker after selecting emoji
  };

  /**
   * handleSend function is triggered when the user submits the message form.
   * It emits the message to the server through the socket connection and clears the input field.
   *
   * @param {Object} e - The event object triggered by the form submission.
   * @returns {void}
   */
  const handleSend = (e) => {
    e.preventDefault();

    socket.emit("message", {
      chatId: chosenChatID,
      senderId: userId,
      content: message,
    });
    setMessage(""); // Clear the input field after sending the message
  };

  return (
    <form
      onSubmit={handleSend}
      className="flex flex-col md:flex-row items-center p-4 bg-input dark:bg-inputDark border-t border-blue-800 dark:border-gray-700 gap-3">
      {/* Input Field */}
      <input
        type="text"
        placeholder={
          chosenChatID === null
            ? "Click on a chat to start messaging"
            : "Type your message..."
        }
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-grow w-full md:w-auto p-3 border border-blue-500 dark:border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={chosenChatID === null} // Disable input if no chat is selected
      />

      {/* Emoji Button */}
      <button
        type="button"
        className="p-3  w-full md:w-1/6 rounded-lg bg-button transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 "
        onClick={() => setShowEmojiPicker(!showEmojiPicker)} // Toggle emoji picker visibility
      >
        😊
      </button>

      {/* Display Emoji Picker if the state is true */}
      {showEmojiPicker && (
        <div
          className="absolute z-10 
               bg-white 
               mb-20
               rounded-md 
               shadow-md 
               max-h-40 
               overflow-y-auto 
               w-auto
               ">
          <EmojiPicker onEmojiClick={handleEmojiSelect} />
        </div>
      )}

      {/* Send Button */}
      <button
        type="submit"
        className={`p-3 w-full md:w-1/6 rounded-lg transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          chosenChatID === null
            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
            : "bg-button text-white "
        }`}>
        Send
      </button>
    </form>
  );
}

export default Message;
