
const Body = () => {
  return (
    <section className="flex flex-col flex-grow bg-gray-50 p-4 overflow-y-auto">
      {/* Chat Messages */}
      <div className="space-y-4">
        {/* Message from the user */}
        <div className="flex justify-end">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg max-w-md shadow-md">
            Hello! How are you?
          </div>
        </div>

        {/* Message from the contact */}
        <div className="flex justify-start">
          <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg max-w-md shadow-md">
            I'm good, thank you! What about you?
          </div>
        </div>

        {/* More messages */}
        <div className="flex justify-end">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg max-w-md shadow-md">
            I'm doing great! Thanks for asking.
          </div>
        </div>
      </div>
    </section>
  );
};

export default Body;
