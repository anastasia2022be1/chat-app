/**
 * ContactList component displays a grouped list of contacts.
 * Contacts are grouped alphabetically by the first letter of their username.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array} props.contacts - A list of contact objects to display.
 * Each contact object should have the following structure:
 * {
 *   _id: string,            // Unique identifier for the contact
 *   username: string,       // Username of the contact
 *   profilePicture: string, // URL of the contact's profile picture (optional)
 * }
 * @param {Function} props.handleContactClick - Callback function triggered when a contact is clicked.
 * Receives the contact's ID as a parameter.
 *
 * @returns {JSX.Element} A list of grouped contacts with sticky headers.
 */
const ContactList = ({ contacts, handleContactClick }) => {
  /**
   * Groups contacts by the first letter of their username.
   *
   * @constructor
   * @param {Array} contacts - List of contact objects.
   * @returns {Object} An object with keys as the first letters and values as arrays of contacts.
   */
  const groupedContacts = contacts.reduce((acc, contact) => {
    const firstLetter = contact.username[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(contact);
    return acc;
  }, {});

  /**
   * A sorted array of the first letters used as group headers.
   *
   * @type {Array<string>}
   */
  const sortedLetters = Object.keys(groupedContacts).sort();

  /**
   * The base URL for fetching profile pictures or other resources.
   * Uses an environment variable or defaults to 'http://localhost:3000'.
   *
   * @type {string}
   */
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  return (
    <ul>
      {sortedLetters.map((letter) => (
        <div key={letter}>
          {/* Sticky Header */}
          <div className="sticky top-0 bg-input mx-2 py-1 px-4 mb-5 font-bold rounded-full">
            {letter}
          </div>
          {/* Contacts under the letter */}
          {groupedContacts[letter].map((contact, index) => (
            <li
              key={index}
              className="flex items-center py-2 px-4 mb-5 bg-gray-200 dark:bg-gray-200 rounded-xl mx-2"
              onClick={() => handleContactClick(contact._id)}>
              <div className="mr-2">
                {contact.profilePicture ? (
                  <img
                    src={baseUrl + contact.profilePicture}
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
        </div>
      ))}
    </ul>
  );
};

export default ContactList;
