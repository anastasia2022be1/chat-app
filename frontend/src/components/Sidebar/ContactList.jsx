
const ContactList = ({ contacts, handleContactClick }) => (
  <ul className="space-y-2">
    {contacts.map((contact, index) => (
      <li
        key={index}
        className="flex items-center py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300 transition"
        onClick={() => handleContactClick(contact._id)}
      >
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
);

export default ContactList