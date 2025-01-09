import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SearchBar = ({ searchQuery, handleQueryChange, handleSearch }) => (
  <div className="search-bar mb-4  relative w-full md:w-2/3 lg:w-1/2 mx-auto">
    <input
      type="text"
      value={searchQuery}
      onChange={handleQueryChange}
      placeholder="Search Contacts"
      className="w-full p-3  border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition "
    />
    <span className="hidden lg:inline">
    <FontAwesomeIcon
      icon="fa-solid fa-magnifying-glass"
      onClick={handleSearch}
      className="absolute right-3 top-2 transform translate-y-1/2 text-gray-500 cursor-pointer text-2xl hover:text-blue-500 transition "
    /></span>
  </div>
);

export default SearchBar;

