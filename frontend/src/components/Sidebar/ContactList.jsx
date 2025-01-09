const ContactList = ({ contacts, handleContactClick }) => {
  // Group contacts by the first letter of their username
  const groupedContacts = contacts.reduce((acc, contact) => {
    const firstLetter = contact.username[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(contact);
    return acc;
  }, {});

  // Get sorted letters
  const sortedLetters = Object.keys(groupedContacts).sort();

  return (
    <ul>
      {sortedLetters.map((letter) => (
        <div key={letter}>
          {/* Sticky Header */}
          <div className="sticky top-0 bg-input mx-2 py-1 px-4 mb-5  font-bold rounded-full">
            {letter}
          </div>
          {/* Contacts under the letter */}
          {groupedContacts[letter].map((contact, index) => (
            <li
              key={index}
              className="flex items-center py-2 px-4 mb-5 bg-gray-200 dark:bg-gray-200 rounded-xl mx-2"
              onClick={() => handleContactClick(contact._id)}
            >
              <div className="mr-2">
                {contact.profilePicture ? (
                  <img
                    src={"http://localhost:3000" + contact.profilePicture}
                    alt="Profile"
                    width={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">{letter}</span>
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
