import User from "../models/User.js";

export const addContact = async (req, res) => {
  const { contactEmail } = req.body;
  const userId = req.user.userId; // From the JWT token

  if (!contactEmail) {
    return res.status(400).json({ error: "Contact email is required" });
  }

  try {
    // Check if the contact user exists
    const contactUser = await User.findOne({ email: contactEmail });
    if (!contactUser) {
      return res.status(404).json({ error: "Contact not found" });
    }

    // Check if the user is trying to add themselves
    if (contactUser._id.toString() === userId) {
      return res
        .status(400)
        .json({ error: "You cannot add yourself as a contact" });
    }

    const user = await User.findById(userId);

    // Ensure the contact is not already in the list
    if (user.contacts.includes(contactUser._id)) {
      return res
        .status(400)
        .json({ error: "This user is already in your contacts" });
    }

    // Add the contact to the user's list
    user.contacts.push(contactUser._id);
    await user.save();

    res.status(200).json({ message: "Contact added successfully" });
  } catch (error) {
    console.error("Error adding contact:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

//--------------------------------------------------------------------------

export const contactsList = async (req, res) => {
  const userId = req.user.userId; // From the JWT token

  try {
    const user = await User.findById(userId).populate(
      "contacts",
      "username  profilePicture "
    );

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(user.contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error.message);
    res.status(500).json({ error: "Failed to fetch contacts." });
  }
};

//-----------------------------------------------------------------------------------

export const searchContact = async (req, res) => {
  const userId = req.user.userId;

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const user = await User.findById(userId).populate("contacts");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const filteredContacts = user.contacts.filter((contact) =>
      contact.username.toLowerCase().includes(query.toLowerCase())
    );

    res.status(200).json(filteredContacts);
  } catch (error) {
    console.error("Error searching contacts:", error.message);
    res.status(500).json({ error: "Failed to search contacts." });
  }
};
