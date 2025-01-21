import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * SearchBar component renders a search input field for searching contacts.
 * It also includes a magnifying glass icon that triggers the search action when clicked.
 *
 * @param {string} searchQuery - The current search query input by the user.
 * @param {Function} handleQueryChange - Function to handle changes in the search input field.
 * @param {Function} handleSearch - Function to perform the search action when the search icon is clicked.
 * @returns {JSX.Element} The rendered search bar with an input field and a search icon.
 */
const SearchBar = ({ searchQuery, handleQueryChange, handleSearch }) => (
  <div className="search-bar mb-4  relative w-full md:w-2/3 lg:w-1/2 mx-auto">
    <input
      type="text"
      value={searchQuery}
      onChange={handleQueryChange}
      placeholder="Search Contacts"
      className="w-full p-3  border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition "
    />
    <span className=" lg:inline">
      <FontAwesomeIcon
        icon="fa-solid fa-magnifying-glass"
        onClick={handleSearch}
        className="absolute right-3 top-2 transform translate-y-1/2 text-gray-500 cursor-pointer text-2xl hover:text-blue-500 transition "
      />
    </span>
  </div>
);

export default SearchBar;
