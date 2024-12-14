import Sidebar from "../components/Sidebar.jsx";
import Body from "../components/Body.jsx";
import Message from "../components/Message.jsx";
import Header from "../components/Header.jsx";

const Chat = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <Header />
      </header>

      <div className="flex flex-grow overflow-hidden">
        <aside className="bg-gray-200 w-64 p-4 border-r border-gray-300 hidden md:block">
          <Sidebar />
        </aside>
        <div className="flex flex-col flex-grow">
          <div className="flex-grow overflow-y-auto">
            <Body />
          </div>
          <footer className="bg-white border-t border-gray-300">
            <Message />
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Chat;
