import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SearchBar = ({ searchQuery, handleQueryChange, handleSearch }) => (
  <div className="search-bar mb-4 relative">
    <input
      type="text"
      value={searchQuery}
      onChange={handleQueryChange}
      placeholder="Search Contacts"
      className="w-full p-2 border border-gray-300 rounded-md"
    />
    <FontAwesomeIcon 
      icon="fa-solid fa-magnifying-glass" 
      onClick={handleSearch} 
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
    />
  </div>
);

export default SearchBar