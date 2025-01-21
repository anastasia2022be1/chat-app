import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SearchBar from "./Sidebar/SearchBar.jsx";
import ContactList from "./Sidebar/ContactList.jsx";
import ChatList from "./Sidebar/ChatList.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Sidebar component that handles displaying contacts and chats.
 * Allows users to toggle between contact list and chat list,
 * search for contacts, and initiate new chats.
 *
 * @param {Object} props - The component's props.
 * @param {Function} props.handleSelectChat - Function to handle selecting a chat.
 * @param {Function} props.handleChosenChatMessage - Function to handle updating chosen chat messages.
 * @returns {JSX.Element} The Sidebar component.
 */
const Sidebar = ({ handleSelectChat, handleChosenChatMessage }) => {
  const [contacts, setContacts] = useState([]);
  const [chats, setChats] = useState([]);
  const [modus, setModus] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();

  /**
   * Fetches the contact list from the API.
   * Sets the contacts state with the fetched data.
   */
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

  /**
   * Navigates to the 'AddContact' page when adding a new contact.
   */
  const handleAddContact = () => {
    navigate("/AddContact");
  };

  /**
   * Toggles the view between contacts and chats.
   */
  const toggleButton = () => {
    setModus(!modus);
  };

  /**
   * Handles a click on a contact.
   * If a chat with the contact exists, it fetches the chat messages.
   * If no chat exists, it creates a new chat and navigates to it.
   *
   * @param {string} contactId - The ID of the selected contact.
   */
  const handleContactClick = async (contactId) => {
    setModus(!modus);
    const allParticipantIds = chats.flatMap((chat) =>
      chat.participants.map((participant) => participant._id)
    ); // Array of chat participants

    if (allParticipantIds.includes(contactId)) {
      console.log(chats);
      const chosenChat = chats.find((chat) =>
        chat.participants.some((participant) => participant._id === contactId)
      );
      console.log(chosenChat);
      handleChosenChatMessage([]);
      try {
        const response = await fetch(
          `http://localhost:3000/api/message/${chosenChat._id}`,
          {
            method: "GET",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch chat messages");
        }

        console.log("Hier die Daten", data); // Update the chat messages state
        handleChosenChatMessage(data);
      } catch (err) {
        setError(err.message);
      }

      /**
       * Handles a click on a chat, fetching the messages for the selected chat.
       *
       * @param {Object} chat - The chat object that was clicked.
       */
      handleSelectChat(chosenChat._id);
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

        navigate(`/chat/${data.newChat._id}`);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  /**
   * Get messages from the selected chat.
   */
  const handleChatClick = async (chat) => {
    handleChosenChatMessage([]);

    try {
      const response = await fetch(
        `http://localhost:3000/api/message/${chat._id}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch chat messages");
      }

      handleChosenChatMessage(data);
    } catch (err) {
      setError(err.message);
    }

    handleSelectChat(chat._id);
  };

  /**
   * Handles the search functionality for filtering contacts based on the search query.
   */
  function handleSearch() {
    const filteredContacts = contacts.filter((contact) => {
      return (
        contact.username.slice(0, searchQuery.length).toLowerCase() ===
        searchQuery.toLowerCase()
      );
    });
    setSearchResults(filteredContacts);
    console.log(filteredContacts);
  }

  /**
   * Handles changes to the search query and triggers search when typing.
   *
   * @param {Object} e - The event object for the input change.
   */
  const handleQueryChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() === "") {
      setSearchResults([]); // Clear results when the input is empty
    } else {
      handleSearch(); // Perform search when typing
    }
  };

  return (
    <aside className="w-full bg-gray-100 dark:bg-sky-950 flex flex-col p-3 border-r border-gray-300 dark:border-gray-700 rounded-xl shadow-md h-3/4 lg:h-full">
      {/* Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        handleQueryChange={handleQueryChange}
        handleSearch={handleSearch}
      />

      {/* Show search results */}
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

      {/* Toggle Button */}
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
      <div className="flex-grow overflow-y-auto h-20  lg:h-fit">
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
        className="mt-6 w-full bg-green-500 text-white py-2 px-4 rounded-xl hover:bg-green-600 transition">
        <FontAwesomeIcon icon="fa-solid fa-user-plus" className="mr-2" />
        <span className="hidden sm:inline">Add New Contact</span>
      </button>
    </aside>
  );
};

export default Sidebar;
