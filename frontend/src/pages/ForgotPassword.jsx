import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

/**
 * ForgotPassword component allows users to request a password reset by entering their email.
 * The component sends a POST request to the server with the provided email, and displays success or error messages.
 *
 * @component
 * @example
 * return (
 *   <ForgotPassword />
 * )
 */
export default function ForgotPassword() {
  const [email, setEmail] = useState(""); // Holds the email entered by the user
  const [message, setMessage] = useState(""); // Holds the success message
  const [error, setError] = useState(""); // Holds the error message

  /**
   * Handles the form submission for the password reset request.
   * It validates the email input and sends a POST request to the server.
   *
   * @param {Object} e - The event object from the form submission.
   * @async
   */
  async function handleSubmit(e) {
    e.preventDefault();

    // Check if the email field is empty
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setError("");
    setMessage("");

    try {
      // Sending POST request to the server to request a password reset
      const response = await fetch(
        "http://localhost:3000/api/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }), // Email sent to the server
        }
      );

      const data = await response.json();

      // Check if the response is successful
      if (!response.ok) {
        setError(data.error || "Failed to send password reset email.");
        return;
      }

      setMessage("Password reset email sent. Please check your inbox.");
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again later.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center max-h-screen p-10 ">
      <div className="bg-white bg-opacity-90 dark:bg-gray-800 p-8 mt-20 rounded-lg shadow-xl w-full max-w-md sm:max-w-lg transition-transform transform hover:scale-105">
        <h2 className="text-3xl font-semibold text-center mb-6 text-backgroundChatDark dark:text-textColorDark">
          Forgot Password
        </h2>

        {/* Display error message if any */}
        {error && (
          <p className="flex items-center justify-center space-x-2 text-center text-error bg-red-100 p-4 rounded-lg shadow-md ring-2 ring-red-300 font-medium text-lg dark:bg-errorDark dark:text-red-100 mb-4">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="text-xl text-error dark:text-red-100"
            />
            <span>{error}</span>
          </p>
        )}

        {/* Display success message if any */}
        {message && (
          <p className="text-green-500 text-center mb-4">{message}</p>
        )}

        {/* Password reset form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-lg font-medium text-title dark:text-gray-200">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg mt-2 p-3 focus:outline-none focus:ring-2 focus:ring-blueCustom dark:bg-gray-700 dark:text-gray-200"
              placeholder="Enter your email"
              aria-label="Email input"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              aria-label="Send Reset Link"
              className="w-full py-3 bg-button mt-3 text-white font-semibold rounded-lg hover:bg-blueCustom transition duration-300 ease-in-out">
              Send Reset Link
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          {/* Link to the login page */}
          <a
            href="/login"
            className="text-blue-600 hover:underline dark:text-blue-400">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
