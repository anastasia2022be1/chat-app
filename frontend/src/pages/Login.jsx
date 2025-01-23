import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Login component provides a user interface for users to log into the application.
 * It includes form validation, error handling, and sending login data to the server.
 * Upon successful login, it stores the authentication token and user ID in local storage and redirects to the chat page.
 *
 * @component
 * @example
 * return (
 *   <Login />
 * )
 */
export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  /**
   * Handles input field changes and updates the form data state.
   *
   * @param {Object} e - The event object triggered by input field changes.
   */
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  /**
   * Handles the form submission for logging in.
   * It validates the input fields, sends a POST request to the backend for authentication,
   * and redirects to the chat page if successful.
   *
   * @param {Object} e - The event object from the form submission.
   * @async
   */
  async function handleSubmit(e) {
    e.preventDefault();

    // Validate if both email and password fields are filled
    if (!formData.email || !formData.password) {
      setError("Both fields are required!");
      return;
    }

    // Clear any previous errors
    setError("");

    try {
      // Send the login data to the backend for verification
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Handle unsuccessful login attempt
      if (!response.ok) {
        setError(data.error);
        return;
      }

      console.log(data);

      // Store token and userId in localStorage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userId", data.userId);

      // On successful login, redirect to the chat page
      navigate("/chat");
    } catch (error) {
      console.error("Login failed:", error);
      setError("An error occurred. Please try again.");
    }
  }

  async function handleResendVerify() {
    const { email, password } = formData;

    try {
      const response = await fetch("http://localhost:3000/api/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setError("A confirmation email has been sent to your email.");
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error("Error when resending email:", error);
      setError("An error has occurred. Please try again.");
    }
  }

  return (
    <div className="flex flex-col max-h-screen items-center justify-center p-10">
      <div className="bg-white bg-opacity-90 dark:bg-gray-800 p-8 mt-20 rounded-lg shadow-xl w-full max-w-md sm:max-w-lg transition-all transform hover:scale-105">
        <h2 className="text-3xl font-semibold text-center mb-6 text-backgroundChatDark dark:text-textColorDark">
          Login
        </h2>

        {/* Display error message if any */}
        {error && (
          <div className="text-center mb-4 text-yellow-800 bg-yellow-100 p-4 rounded-lg shadow-md ring-2 ring-yellow-300 font-medium text-lg flex items-center justify-center space-x-2">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="text-xl text-yellow-800"
            />

            <span>{error}</span>
            {error === "Account not verified" ? (
              <button onClick={handleResendVerify}>
                Resend verification E-Mail
              </button>
            ) : (
              <p></p>
            )}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Email input */}
          <div>
            <label className="block text-lg font-medium text-title">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg mt-2 p-3 focus:outline-none focus:ring-2 focus:ring-blueCustom dark:bg-gray-700 dark:text-gray-200"
              placeholder="Enter your email"
            />
          </div>

          {/* Password input */}
          <div>
            <label className="block text-lg font-medium text-title">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg mt-2 p-3 focus:outline-none focus:ring-2 focus:ring-blueCustom dark:bg-gray-700 dark:text-gray-200"
              placeholder="Enter your password"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full py-3 bg-button mt-6 text-white font-semibold rounded-lg hover:bg-blueCustom transition duration-300 ease-in-out">
              Login
            </button>
          </div>
        </form>

        <div className="mt-4 text-center text-black dark:text-white">
          {/* Link to Forgot Password Page */}
          <p>
            <a
              href="/forgot-password"
              className="text-blue-600 hover:underline">
              Forgot Password?
            </a>
          </p>

          {/* Link to Register Page */}
          <p>
            Don't have an account? <span> </span>
            <a href="/register" className="text-title hover:underline">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}