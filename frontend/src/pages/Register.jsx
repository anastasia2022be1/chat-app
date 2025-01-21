import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Register component provides a user interface for new users to create an account.
 * It includes form validation, handling file uploads (profile picture), and sending the registration data to the server.
 * If registration is successful, the user is prompted to verify their email and redirected to the login page.
 *
 * @component
 * @example
 * return (
 *   <Register />
 * )
 */
export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
  });

  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState("");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  /**
   * Opens the file input dialog for selecting a profile picture.
   */
  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  /**
   * Handles form input changes and updates the corresponding form data in the state.
   * If the input type is 'file', it sets the profile picture and generates a preview.
   *
   * @param {Object} e - The event object triggered by form input changes.
   */
  function handleChange(e) {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0]; // Get the first selected file

      // Set the selected file in the formData
      setFormData((prevData) => ({
        ...prevData,
        profilePicture: file,
      }));

      // Generate a URL for the file and set the preview image URL
      if (file) {
        const fileURL = URL.createObjectURL(file); // Create a URL for the file
        setProfilePicPreview(fileURL); // Store the file's preview URL
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  }

  /**
   * Handles the form submission for user registration.
   * It validates the input fields, sends the registration data to the backend, and handles errors or success.
   *
   * @param {Object} e - The event object from the form submission.
   * @async
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // Validation: Ensure all fields are filled
    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required!");
      return;
    }

    // Clear error messages if all fields are valid
    setError("");

    // Prepare data to be sent to the server
    const form = new FormData();
    form.append("username", formData.username);
    form.append("email", formData.email);
    form.append("password", formData.password);
    form.append("profilePicture", formData.profilePicture);

    try {
      // Send the form data to the backend
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        body: form, // Use FormData for file uploads
      });
      console.log(response);

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        setError(data.error || "Account with this email already exists!");
        return;
      }

      // Indicate email verification is required
      setIsVerifying(true);
      setError(
        "Registration successful! Please check your email to verify your account."
      );
      // Navigate to login page after registration
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Wait 2 seconds before redirecting
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Registration failed!!!.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-5 max-h-screen ">
      <div className="p-6 mt-4 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg bg-white bg-opacity-90 dark:bg-gray-800 transition-all transform hover:scale-105">
        <h2 className="text-2xl font-semibold text-center mb-6 text-backgroundChatDark dark:text-textColorDark">
          Create an Account
        </h2>

        {/* Error message display */}
        {error && (
          <p className="text-center mb-4 text-yellow-800 bg-yellow-100 p-4 rounded-lg shadow-md ring-2 ring-yellow-300 font-medium text-lg flex items-center justify-center space-x-2">
            <FontAwesomeIcon
              icon="fa-solid fa-info-circle"
              className="text-xl text-yellow-800"
            />
            <span>{error}</span>
          </p>
        )}

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={handleFileClick}
              aria-label="Upload Profile Picture"
              className="w-24 h-24 rounded-full border-4 border-blue-500 flex items-center justify-center mb-4 shadow-lg hover:shadow-xl transition-all focus:outline-none">
              {profilePicPreview ? (
                <img
                  src={profilePicPreview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <FontAwesomeIcon
                  icon="fa-solid fa-camera"
                  className="text-gray-500 text-2xl"
                />
              )}
            </button>
            <input
              type="file"
              name="profilePicture"
              onChange={handleChange}
              ref={fileInputRef}
              className="hidden"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-title dark:text-titleDark">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blueCustom dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter your username"
            />
          </div>

          {/* Email */}
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

          {/* Password */}
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

          {/* Confirm Password */}
          <div>
            <label className="block text-lg font-medium text-title">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg mt-2 p-3 focus:outline-none focus:ring-2 focus:ring-blueCustom dark:bg-gray-700 dark:text-gray-200"
              placeholder="Confirm your password"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full py-3 bg-button mt-6 text-white font-semibold rounded-lg hover:bg-blueCustom transition">
              Register
            </button>
          </div>
        </form>

        {/* Link to Login Page */}
        <div className="mt-4 text-center text-black dark:text-white">
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-title hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
