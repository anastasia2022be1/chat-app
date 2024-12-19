import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
        console.log(data);
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

    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const userId = localStorage.getItem("userId");

        const response = await fetch(`http://localhost:3000/api/chat/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
    <aside className="w-64 h-full bg-gray-100 flex flex-col p-4 border-r border-gray-300 z-10">
      <SearchBar
        searchQuery={searchQuery}
        handleQueryChange={handleQueryChange}
        handleSearch={handleSearch}
      />
      <div className="search-results">
        {searchResults.length > 0 && (
          <ContactList contacts={searchResults} handleContactClick={handleContactClick} />
        )}
      </div>

      <button
        onClick={toggleButton}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition mb-4"
      >
        {!modus ? "Contacts" : "Chats"}
      </button>

      <div>
        {modus ? (
          error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <ContactList contacts={contacts} handleContactClick={handleContactClick} />
          )
        ) : (
          error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <ChatList chats={chats} handleChatClick={handleChatClick} />
          )
        )}
      </div>

      <button
        onClick={handleAddContact}
        className="mt-auto w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"
      >
        Add New Contact
      </button>
    </aside>
  );
};

export default Sidebar;