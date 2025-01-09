import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchBar from "./Sidebar/SearchBar.jsx";
import ContactList from "./Sidebar/ContactList.jsx";
import ChatList from "./Sidebar/ChatList.jsx";

const Sidebar = ({ chats, setChats }) => {
  console.log(chats);

  const [contacts, setContacts] = useState([]);
  const [modus, setModus] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const response = await fetch("http://localhost:3000/api/contactslist", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch contacts");
        }

        setContacts(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const userId = localStorage.getItem("userId");

        const response = await fetch(
          `http://localhost:3000/api/chat/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch chats");
        }

        setChats(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchContacts();
    fetchChats();
  }, [modus]);

  const handleAddContact = () => {
    navigate("/AddContact");
  };

  const toggleButton = () => {
    setModus(!modus);
  };

  const handleContactClick = async (contactId) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          senderId: localStorage.getItem("userId"),
          recieverId: contactId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create chat");
      }

      navigate(`/chat/${data.newChat._id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChatClick = (id) => {
    console.log(id);
  };

  const handleSearch = () => {
    const filteredContacts = contacts.filter((contact) =>
      contact.username.toLowerCase().startsWith(searchQuery.toLowerCase())
    );
    setSearchResults(filteredContacts);
  };

  const handleQueryChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() === "") {
      setSearchResults([]);
    } else {
      handleSearch();
    }
  };

  return (
    <aside className="w-full sm:w-72 bg-gray-100 dark:bg-sky-950 flex flex-col p-3 border-r border-gray-300 dark:border-gray-700 rounded-xl shadow-md h-full">
      {/* Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        handleQueryChange={handleQueryChange}
        handleSearch={handleSearch}
      />
  
      {/* Toggle Button */}
      <button
        onClick={toggleButton}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-blue-600 transition mb-4 flex items-center justify-center"
      >
        {modus ? (
          <FontAwesomeIcon icon="fa-regular fa-comment" className="mr-2" />
        ) : (
          <FontAwesomeIcon icon="fa-solid fa-user-group" className="mr-2" />
        )}
        <span className="hidden sm:inline">{!modus ? "Contacts" : "Chats"}</span>
      </button>
  
      {/* Scrollable Content Area */}
      <div className="flex-grow overflow-y-auto">
        {modus ? (
          error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <div className="max-h-[400px] overflow-y-auto ">
              <ContactList
                contacts={contacts}
                handleContactClick={handleContactClick}
              />
            </div>
          )
        ) : error ? (
          <p className="text-error dark:text-errorDark text-center">{error}</p>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            <ChatList chats={chats} handleChatClick={handleChatClick} />
          </div>
        )}
      </div>
  
      {/* Add Contact Button */}
      <button
        onClick={handleAddContact}
        className="mt-6 w-full bg-green-500 text-white py-2 px-4 rounded-xl hover:bg-green-600 transition"
      >
        <FontAwesomeIcon icon="fa-solid fa-user-plus" className="mr-2" />
        <span className="hidden sm:inline">Add New Contact</span>
      </button>
    </aside>
  );
  
};

export default Sidebar;
