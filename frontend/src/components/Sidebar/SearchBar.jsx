import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * SearchBar component renders a search input field with a magnifying glass icon.
 * The input allows users to type in a query to search contacts, while the icon can trigger the search action.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.searchQuery - The current search query entered by the user.
 * @param {Function} props.handleQueryChange - Callback function triggered on input change.
 * Receives the input event as a parameter.
 * @param {Function} props.handleSearch - Callback function triggered when the search icon is clicked.
 *
 * @returns {JSX.Element} The rendered search bar with an input field and a search icon.
 */
const SearchBar = ({ searchQuery, handleQueryChange, handleSearch }) => (
  <div className="search-bar mb-4 relative w-full md:w-2/3 lg:w-1/2 mx-auto">
    <input
      type="text"
      value={searchQuery}
      onChange={handleQueryChange}
      placeholder="Search Contacts"
      className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition"
    />
    <span className="absolute right-3 top-2 transform -translate-y-1/2">
      <FontAwesomeIcon
        icon="fa-solid fa-magnifying-glass"
        onClick={handleSearch}
        className="text-gray-500 cursor-pointer text-2xl hover:text-blue-500 transition"
      />
    </span>
  </div>
);

export default SearchBar;
