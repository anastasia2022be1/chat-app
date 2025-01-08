import { text } from "@fortawesome/fontawesome-svg-core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle form input change
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  // Handle form submission

  async function handleSubmit(e) {
    e.preventDefault();

    // validation to check if both fields are filled
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
        body: JSON.stringify(formData)
      });


       const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      console.log(data);
      

      // Store token and usetId in localStorage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userId", data.userId);
     
      // On successful login, redirect to the chat page
      navigate("/chat");
    } catch (error) {
      console.error("Login failed:", error);
      setError("An error occurred. Please try again.");
    }
  }
  return (
    <div className="flex flex-col max-h-screen items-center justify-center p-10">
      <div className="bg-white bg-opacity-90 dark:bg-gray-800 p-8 mt-20 rounded-lg shadow-xl w-full max-w-md sm:max-w-lg transition-all transform hover:scale-105">
        <h2 className="text-3xl font-semibold text-center mb-6 text-backgroundChatDark dark:text-textColorDark">
          Login
        </h2>

        {/* Error Message */}
        {error && (
          <p className="text-center mb-4 text-yellow-800 bg-yellow-100 p-4 rounded-lg shadow-md ring-2 ring-yellow-300 font-medium text-lg flex items-center justify-center space-x-2">
            <FontAwesomeIcon
              icon="fa-solid fa-info-circle"
              className="text-xl text-yellow-800"
            />
            <span>{error}</span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
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
          {/* // Link to the ForgotPassword Page */}
          <p>
            <a href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot Password?
            </a>
          </p>

          {/* Link to Register Page */}
          <p>
            Don't have an account?{" "}
            <span> </span>
            <a href="/register" className="text-title hover:underline">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}