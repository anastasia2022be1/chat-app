// Message Component
const Message = () => {
  return (
    <div className="flex items-center p-4 bg-gray-100 border-t border-gray-300">
      {/* Input Field */}
      <input
        type="text"
        placeholder="Type your message..."
        className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mr-3"
      />

      {/* Send Button */}
      <button className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
        Send
      </button>
    </div>
  );
};

export default Message;
