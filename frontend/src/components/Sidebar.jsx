import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SearchBar from "./Sidebar/SearchBar.jsx";
import ContactList from "./Sidebar/ContactList.jsx";
import ChatList from "./Sidebar/ChatList.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Sidebar = ({ handleSelectChat, setChosenChatMessages, chosenChatID }) => {
  // State for managing contacts, chats, mode (contacts or chats), error messages, and search functionality
  const [contacts, setContacts] = useState([]); // Stores contact list
  const [chats, setChats] = useState([]); // Stores chat list
  const [modus, setModus] = useState(false); // Switch between contacts and chats display modes
  const [error, setError] = useState(""); // Stores error messages
  const [searchQuery, setSearchQuery] = useState(""); // Current search input
  const [searchResults, setSearchResults] = useState([]); // Search results for contacts

  const navigate = useNavigate();

  // Effect triggered when `chosenChatID` changes (placeholder, add functionality if needed)
  useEffect(() => {}, [chosenChatID]);

  // Fetches contacts and chats when the mode (`modus`) changes
  useEffect(() => {
    // Fetch contact list
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

        setContacts(data); // Update contacts state
        console.log(data);
      } catch (err) {
        setError(err.message);
      }
    };

    // Fetch chat list
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

        setChats(data); // Update chats state
        console.log(data);
      } catch (err) {
        setError(err.message);
      }
    };

    // Fetch data based on mode
    fetchContacts();
    fetchChats();
  }, [modus]);

  // Redirect to the "Add Contact" page
  const handleAddContact = () => {
    navigate("/AddContact");
  };

  // Toggle between "contacts" and "chats" modes
  const toggleButton = () => {
    setModus(!modus);
  };

  // Handle contact selection and create a new chat if it doesn't already exist
  const handleContactClick = async (contactId) => {
    const allParticipantIds = chats.flatMap((chat) =>
      chat.participants.map((participant) => participant._id)
    ); // Get all chat participants

    if (allParticipantIds.includes(contactId)) {
      alert("Chat already exists");
    } else {
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

        navigate(`/chat/${data.newChat._id}`); // Redirect to the new chat
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Handle chat selection and fetch chat messages
  const handleChatClick = async (chat) => {
    console.log(chat);
    setChosenChatMessages([]);
    try {
      const response = await fetch(
        `http://localhost:3000/api/message/${chat._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch chat messages");
      }

      setChosenChatMessages(data); // Update the chat messages state
    } catch (err) {
      setError(err.message);
    }

    handleSelectChat(chat._id); // Update the selected chat
  };

  // Filters contacts based on the search query
  const handleSearch = () => {
    const filteredContacts = contacts.filter((contact) => {
      return (
        contact.username.slice(0, searchQuery.length).toLowerCase() ===
        searchQuery.toLowerCase()
      );
    });
    setSearchResults(filteredContacts); // Update search results
    console.log(filteredContacts); // Debugging
  };

  // Handles changes to the search input
  const handleQueryChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() === "") {
      setSearchResults([]); // Clear results if input is empty
    } else {
      handleSearch(); // Perform search
    }
  };

  return (
    <aside className="w-full bg-gray-100 dark:bg-sky-950 flex flex-col p-3 border-r border-gray-300 dark:border-gray-700 rounded-xl shadow-md h-3/4 lg:h-full">
      {/* Search Bar Component */}
      <SearchBar
        searchQuery={searchQuery}
        handleQueryChange={handleQueryChange}
        handleSearch={handleSearch}
      />

      {/* Search Results Display */}
      <div className="search-results">
        {searchResults.length > 0 && (
          <ul className="space-y-2">
            {searchResults.map((contact, index) => (
              <li
                key={index}
                className="flex items-center py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                onClick={() => handleContactClick(contact._id)}>
                <div className="mr-3">
                  {contact.profilePicture ? (
                    <img
                      src={"http://localhost:3000" + contact.profilePicture}
                      alt="Profile"
                      width={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">No Image</span>
                    </div>
                  )}
                </div>
                <p className="text-sm">{contact.username}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Toggle Button (Contacts/Chats) */}
      <button
        onClick={toggleButton}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-blue-600 transition mb-4 flex items-center justify-center ">
        {modus ? (
          <FontAwesomeIcon icon="fa-regular fa-comment" className="mr-2" />
        ) : (
          <FontAwesomeIcon icon="fa-solid fa-user-group" className="mr-2" />
        )}
        <span className="hidden sm:inline">
          {!modus ? "Contacts" : "Chats"}
        </span>
      </button>

      {/* Scrollable Content Area */}
      <div className="flex-grow overflow-y-auto h-20 lg:h-fit">
        {modus ? (
          error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <div className="max-h-[400px] overflow-y-auto">
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
        className="mt-6 w-full bg-green-500 text-white py-2 px-4 rounded-xl hover:bg-green-600 transition">
        <FontAwesomeIcon icon="fa-solid fa-user-plus" className="mr-2" />
        <span className="hidden sm:inline">Add New Contact</span>
      </button>
    </aside>
  );
};

export default Sidebar;
