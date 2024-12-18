import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

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

  // Handle form submission
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
      const data = await response.json();
      console.log(data)
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-6">
          Create an Account
        </h2>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <label
              className="block text-lg font-medium"
              onClick={handleFileClick}>
              <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
            </label>

            {/* Image Preview */}
            <div className="w-32 h-32 rounded-full border-2 border-black flex items-center justify-center mb-4">
              {profilePicPreview ? (
                <img
                  src={profilePicPreview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-gray-500 ">Profile Picture</span>
              )}
            </div>

            <input
              type="file"
              name="profilePicture"
              onChange={handleChange}
              ref={fileInputRef}
              className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ display: "none" }}
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-lg font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-lg font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-lg font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-lg font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition">
              Register
            </button>
          </div>
        </form>

        {/* Link to Login Page */}
        <div className="mt-4 text-center">
          <p>
            Already have an account?
            <a href="/login" className="text-blue-600 hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
