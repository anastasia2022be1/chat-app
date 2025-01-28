import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SearchBar from "./Sidebar/SearchBar.jsx";
import ContactList from "./Sidebar/ContactList.jsx";
import ChatList from "./Sidebar/ChatList.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Sidebar component for displaying and interacting with contacts and chats.
 * Allows users to search, add contacts, view contacts or chats, and handle messages.
 *
 * @param {Object} props
 * @param {Function} props.handleSelectChat - Function to handle the selection of a chat.
 * @param {Function} props.handleChosenChatMessage - Function to handle the chosen chat messages.
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
   * Fetches contacts and updates the state with the retrieved data.
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

    /**
     * Fetches the list of chats and updates the state with the retrieved data.
     */
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
   * Handles adding a new contact by navigating to the AddContact page.
   */
  const handleAddContact = () => {
    navigate("/AddContact");
  };

  /**
   * Toggles between viewing contacts or chats.
   */
  const toggleButton = () => {
    setModus(!modus);
  };

  /**
   * Handles the click event on a contact.
   * If the contact already exists in a chat, it fetches and displays the messages.
   * Otherwise, it creates a new chat with the selected contact.
   *
   * @param {string} contactId - The ID of the clicked contact.
   */
  const handleContactClick = async (contactId) => {
    setModus(!modus);
    const allParticipantIds = chats.flatMap((chat) =>
      chat.participants.map((participant) => participant._id)
    ); // Array of chat participants

    if (allParticipantIds.includes(contactId)) {
      const chosenChat = chats.find((chat) =>
        chat.participants.some((participant) => participant._id === contactId)
      );
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

        handleChosenChatMessage(data);
      } catch (err) {
        setError(err.message);
      }

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
   * Handles the click event on a chat to view its messages.
   *
   * @param {Object} chat - The clicked chat object.
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
   * Deletes a chat by sending a DELETE request to the server.
   *
   * @param {string} chatId - The ID of the chat to be deleted.
   */
  const handleDeleteChat = async (chatId) => {
    try {
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");

      const response = await fetch(`http://localhost:3000/api/chat/${chatId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete chat");
      }

      handleSelectChat(null);
      handleChosenChatMessage([]);
      setChats((prevChats) => prevChats.filter((chat) => chat._id !== chatId));
    } catch (err) {
      console.error("Error deleting chat:", err.message);
    }
  };

  /**
   * Handles search query input and filters the contacts based on the search query.
   *
   * @param {string} query - The search query input.
   */
  const handleSearch = (query) => {
    if (query.trim() === "") {
      setSearchResults([]); // Clear results if search query is empty
    } else {
      const filteredContacts = contacts.filter((contact) =>
        contact.username.toLowerCase().startsWith(query.toLowerCase())
      );
      setSearchResults(filteredContacts);
    }
  };

  /**
   * Handles the change in search query input.
   *
   * @param {Object} e - The event object from the input change.
   */
  const handleQueryChange = (e) => {
    setSearchQuery(e.target.value);
    handleSearch(e.target.value);
  };

  return (
    <aside className="w-full bg-gray-100 dark:bg-sky-950 flex flex-col p-3 border-r border-gray-300 dark:border-gray-700 rounded-xl shadow-md h-3/4 lg:h-full">
      <SearchBar
        searchQuery={searchQuery}
        handleQueryChange={handleQueryChange}
        handleSearch={handleSearch}
      />

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
                      <span className="text-white text-xs">
                        {contact.username.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm">{contact.username}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

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

      <div className="flex-grow overflow-y-auto h-20  lg:h-fit">
        {modus ? (
          error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <div className="max-h-[400px] overflow-y-auto cursor-pointer ">
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
            <ChatList
              chats={chats}
              handleChatClick={handleChatClick}
              handleDeleteChat={handleDeleteChat}
            />
          </div>
        )}
      </div>

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
