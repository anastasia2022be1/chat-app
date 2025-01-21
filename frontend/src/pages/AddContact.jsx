/**
 * `AddContact` component allows the user to add a new contact by entering the contact's email.
 * It handles the validation of the input, sending the request to the server to add the contact,
 * and displays appropriate success or error messages.
 * After a successful addition, it redirects the user to the chat page.
 *
 * @component
 * @example
 * // Usage:
 * <AddContact />
 *
 * @returns {JSX.Element} - A JSX element representing the contact addition form with input for email, error/success messages, and a submit button.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AddContact() {
  const [contactEmail, setContactEmail] = useState(""); // State to store the entered contact email
  const [error, setError] = useState(""); // State to store error messages
  const [successMessage, setSuccessMessage] = useState(""); // State to store success messages

  const navigate = useNavigate(); // Hook to navigate to different routes

  /**
   * Handles the change in the contact email input field.
   *
   * @param {Object} e - The event object from the input change.
   * @returns {void}
   */
  const handleChange = (e) => {
    setContactEmail(e.target.value); // Update the contact email state
  };

  /**
   * Handles the form submission for adding a new contact.
   * Validates the email, sends a POST request to the server, and displays success or error messages.
   *
   * @param {Object} e - The event object from the form submission.
   * @returns {void}
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (!contactEmail) {
      setError("Contact email is required!"); // Display error if email is not entered
      return;
    }

    setError(""); // Reset the error state
    try {
      const token = localStorage.getItem("authToken"); // Get the auth token from localStorage

      const response = await fetch("http://localhost:3000/api/addcontact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
        body: JSON.stringify({ contactEmail }), // Send the contact email in the request body
      });

      const data = await response.json(); // Parse the response data

      if (!response.ok) {
        setError(data.error || "Failed to add contact!"); // Display error if request fails
        return;
      }

      setError(""); // Reset the error state
      setSuccessMessage("🎉 Contact added successfully! 🎉"); // Display success message

      // Wait for 1 second, then navigate to the chat page
      setTimeout(() => {
        setSuccessMessage(""); // Clear the success message
        navigate("/chat"); // Redirect the user to the chat page
      }, 1000);
    } catch (error) {
      console.error("Error adding contact:", error);
      setError("An error occurred. Please try again."); // Display error if an exception occurs
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
