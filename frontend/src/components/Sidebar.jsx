import { useState } from "react";

const Sidebar = () => {
  const [modus, setModus] = useState("Contacts")

  
  
  return (
    <aside className="w-64 h-80 bg-gray-100  flex flex-col p-4 border-r border-gray-300 z-10">

      <div className="contacts">
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition mb-4">
        Search
      </button>
      <div>
        <button>
          Chats
        </button>
        <button>
          Contacts
        </button>
      </div>
    {

      modus?
    }
      <ul className="space-y-2">
        <li className="p-2 bg-white rounded-md shadow-sm hover:bg-blue-100 transition cursor-pointer">
          Contact-1
        </li>
        <li className="p-2 bg-white rounded-md shadow-sm hover:bg-blue-100 transition cursor-pointer">
          Contact-2
        </li>
        <li className="p-2 bg-white rounded-md shadow-sm hover:bg-blue-100 transition cursor-pointer">
          Contact-3
        </li>
        <li className="p-2 bg-white rounded-md shadow-sm hover:bg-blue-100 transition cursor-pointer">
          Contact-4
        </li>
        <li className="p-2 bg-white rounded-md shadow-sm hover:bg-blue-100 transition cursor-pointer">
          Contact-5
        </li>
      </ul>

      <button className="mt-auto w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition">
        Add new contact
      </button>
      </div>
      
      <div className="chats">
        <button>Chat</button>
      </div>
    </aside>
  );
};

export default Sidebar;
