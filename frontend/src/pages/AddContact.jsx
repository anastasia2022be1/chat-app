import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddContact() {
  const [contactEmail, setContactEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setContactEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!contactEmail) {
      setError("Contact email is required!");
      return;
    }

    setError("");
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch("http://localhost:3000/api/addcontact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contactEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to add contact!");
        return;
      }

      setError("");
      setSuccessMessage("🎉 Contact added successfully! 🎉");

      // Wait for 2 seconds, then navigate to the chat page
      setTimeout(() => {
        setSuccessMessage(""); 
        navigate("/chat");
      }, 2000);
    } catch (error) {
      console.error("Error adding contact:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-6">
          Add New Contact
        </h2>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Success Message */}
        {successMessage && (
          <p className="text-green-500 text-center mb-4 ">
            {successMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Email */}
          <div>
            <label className="block text-lg font-medium">Contact Email</label>
            <input
              type="email"
              name="contactEmail"
              value={contactEmail}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter contact's email"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition"
            >
              Add Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}









































