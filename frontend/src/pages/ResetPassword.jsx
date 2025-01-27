import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

/**
 * ResetPassword component allows users to reset their password by entering a new one.
 * It verifies the new password and confirmation match, then sends a POST request
 * to reset the password.
 *
 * @component
 * @example
 * return (
 *   <ResetPassword />
 * )
 */
export default function ResetPassword() {
  const { token } = useParams(); // Token from URL used to identify the user
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState(""); // Holds the new password entered by the user
  const [confirmPassword, setConfirmPassword] = useState(""); // Holds the confirmed password entered by the user
  const [loading, setLoading] = useState(false); // Indicates if the form is being submitted
  const [error, setError] = useState(""); // Holds any error message
  const [success, setSuccess] = useState(false); // Indicates if the password reset was successful

  console.log(token);

  /**
   * Handles the form submission for resetting the password.
   * It checks if the new password and confirmation match, and sends a POST request to the server.
   *
   * @param {Object} e - The event object from the form submission.
   * @async
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    // Validate password length (exactly 8 characters)
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      // Sending POST request to reset the password
      const response = await fetch(
        `http://localhost:3000/api/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword }),
        }
      );

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        setError(
          data.error || "An unexpected error occurred. Please try again."
        );

        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError("An error has occurred. Please try again.");
      setLoading(false);
    }
  };

  // If the password was reset successfully, show the success message
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
          <h2 className="text-green-500 text-xl">
            Password reset successfully!
          </h2>
          <p className="text-gray-800 dark:text-gray-200">
            You can now log in with your new password.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-green-500 text-white p-2 rounded mt-4">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // If not successful, render the reset password form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl mb-4 text-center text-gray-800 dark:text-white">
          Reset Password
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              New password
            </label>
            <input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)} // Update newPassword state on input change
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} // Update confirmPassword state on input change
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full p-2 rounded-lg ${
              loading ? "bg-gray-400" : "bg-green-500"
            } text-white`}
            disabled={loading}>
            {loading ? "Loading..." : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
}
