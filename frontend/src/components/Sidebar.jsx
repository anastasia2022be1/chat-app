import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SearchBar from "./Sidebar/SearchBar.jsx";
import ContactList from "./Sidebar/ContactList.jsx";
import ChatList from "./Sidebar/ChatList.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Sidebar = ({ handleSelectChat, handleChosenChatMessage , chosenChatID}) => {
  console.log('handleSelectChat in Sidebar:', handleSelectChat);
  const [contacts, setContacts] = useState([]);
  const [chats, setChats] = useState([]);
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
        console.log("Contact data", data);
        
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
        console.log(data);
        
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

  // Creates a new chat by sending a POST request to the server.
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

  const handleChatClick = async (chat) => {
    console.log(chat);
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

      console.log("Hier die Daten", data); // Update the chat messages state
      handleChosenChatMessage(data);
    } catch (err) {
      setError(err.message);
    }

    handleSelectChat(chat._id);
  };

  //  delete chat
  const handleDeleteChat = async (chatId) => {
    try {
      const token = localStorage.getItem("authToken");

      // First, we delete the chat from the server.
      const response = await fetch(`http://localhost:3000/api/chat/${chatId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete chat");
      }

      

      // Delete a chat from the chat list
      setChats((prevChats) => {
        const updatedChats = prevChats.filter((chat) => chat._id !== chatId);

        // If the deleted chat is the same as the selected chat
        if (chatId === chosenChatID) {
          handleSelectChat(null); //Reset selected chat
          handleChosenChatMessage([]); // Delete messages
        }

        return updatedChats;
      });
     
    } catch (err) {
      console.error("Error deleting chat:", err.message);
    }
  };

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
            <ChatList
              chats={chats}
              handleChatClick={handleChatClick}
              handleDeleteChat={handleDeleteChat}
            />
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