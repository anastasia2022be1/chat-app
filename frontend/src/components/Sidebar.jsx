import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleAddContact = () => {
    navigate("/AddContact");
  };

  return (
    <aside className="w-64 h-80 bg-gray-100 flex flex-col p-4 border-r border-gray-300 z-10">
      <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition mb-4">
        Search
      </button>

      
      <button
        onClick={handleAddContact}
        className="mt-auto w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition">
        Add new contact
      </button>
    </aside>
  );
};

export default Sidebar;
