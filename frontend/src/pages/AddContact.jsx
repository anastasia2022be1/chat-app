import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AddContact() {
  const [contactEmail, setContactEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setContactEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!contactEmail) {
      setError("Contact email is required!");
      return;
    }

    setError("");
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch("http://localhost:3000/api/addcontact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contactEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to add contact!");
        return;
      }

      setError("");
      setSuccessMessage("🎉 Contact added successfully! 🎉");

      // Wait for 2 seconds, then navigate to the chat page
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/chat");
      }, 1000);
    } catch (error) {
      console.error("Error adding contact:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-20">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        {/* Header */}
        <h2 className="text-2xl font-semibold text-center mb-6 text-backgroundChatDark dark:text-textColorDark">
          <FontAwesomeIcon icon="fa-solid fa-address-book" className="mr-2" />
          <span className="hidden md:inline">Add New Contact</span>
        </h2>

        {/* Error Message */}
        {error && (
          <p className="flex items-center justify-center mb-4 text-red-500 bg-red-100 dark:bg-red-900 rounded-lg shadow p-3">
            <FontAwesomeIcon
              icon="fa-solid fa-exclamation"
              className="mr-2 text-lg"
            />
            <span>{error}</span>
          </p>
        )}

        {/* Success Message */}
        {successMessage && (
          <p className="text-green-500 text-center mb-4 text-lg">
            {successMessage}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Email */}
          <div className="flex flex-col">
            <label
              htmlFor="contactEmail"
              className="block text-md font-medium text-title dark:text-titleDark">
              Contact Email
            </label>
            <input
              id="contactEmail"
              type="email"
              name="contactEmail"
              value={contactEmail}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg mt-2 p-3 focus:outline-none focus:ring-2 focus:ring-blueCustom dark:bg-gray-700 dark:text-gray-200"
              placeholder="Enter contact's email"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-button mt-6  text-white font-semibold rounded-lg hover:bg-blueCustom transition">
            Add Contact
          </button>
        </form>
      </div>
    </div>
  );
}
