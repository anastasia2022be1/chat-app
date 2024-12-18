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
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* email */}
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
          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition">
              Login
            </button>
          </div>
        </form>

        {/* Link to Register Page */}
        <div className="mt-4 text-center">
          <p>
            Don't have an account?
            <a href="/register" className="text-blue-600 hover:underline">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
