import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Register component provides a user interface for new users to create an account.
 * It includes form validation, handling file uploads (profile picture), and sending the registration data to the server.
 * If registration is successful, the user is prompted to verify their email and redirected to the login page.
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Open file input dialog
  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  // Handle input changes
  function handleChange(e) {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData((prevData) => ({
        ...prevData,
        profilePicture: file,
      }));

      if (file) {
        const fileURL = URL.createObjectURL(file);
        setProfilePicPreview(fileURL);
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // Validate if all fields are filled
    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required!");
      return;
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address!");
      return;
    }

    // Validate password length (exactly 8 characters)
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setError("");
    setLoading(true); // Set loading to true when submitting the form

    const form = new FormData();
    form.append("username", formData.username);
    form.append("email", formData.email);
    form.append("password", formData.password);
    form.append("profilePicture", formData.profilePicture);

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        body: form,
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Account with this email already exists!");
        return;
      }

      setIsVerifying(true);
      setError(
        "Registration successful! Please check your email to verify your account."
      );

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError("Registration failed!!!");
      console.error("Registration failed:", error);
    } finally {
      setLoading(false); // Set loading to false after the request is completed
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-5 max-h-screen">
      <div className="p-6 mt-4 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg bg-white bg-opacity-90 dark:bg-gray-800 transition-all transform hover:scale-105">
        <h2 className="text-2xl font-semibold text-center mb-6">
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

        {/* Loading indicator */}
        {loading && <p>Loading...</p>}

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
          <div className="w-full mt-5">
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
