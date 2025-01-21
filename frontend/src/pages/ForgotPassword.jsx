import { useState } from "react";

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
        setError(data.message || "Failed to send password reset email.");
        return;
      }

      setMessage("Password reset email sent. Please check your inbox.");
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again later.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-6">
          Forgot Password
        </h2>

        {/* Display error message if any */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {/* Display success message if any */}
        {message && (
          <p className="text-green-500 text-center mb-4">{message}</p>
        )}

        {/* Password reset form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email state on input change
              className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition">
              Send Reset Link
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          {/* Link to the login page */}
          <a href="/login" className="text-blue-600 hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
