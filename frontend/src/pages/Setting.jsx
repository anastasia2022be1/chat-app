import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

export default function Setting() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    profilePicture: null,
  });
  const [profilePicPreview, setProfilePicPreview] = useState(null); // New state for preview
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);
  const fileInputRef = useRef(null);

    // States for toggling password visibility
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Unauthorized: Please log in first");
          return;
        }

        const response = await fetch("http://localhost:3000/api/settings", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setUser(data);
          setFormData({ ...formData, username: data.username });

          if (data.profilePicture) {
            setProfilePicPreview(data.profilePicture); // Set existing profile picture
          }
        }
      } catch (error) {
        setError("Failed to load user settings");
      }
    };

    fetchUserData();
  }, []);

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleClick = () => {
    navigate('/Chat');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    checkForChanges(newFormData);
    console.log("Form data after change 62:", newFormData);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newFormData = { ...formData, profilePicture: file };
      setFormData(newFormData);
      setProfilePicPreview(URL.createObjectURL(file)); // Update preview
      checkForChanges(newFormData);
    }
  };

  const checkForChanges = (newFormData) => {
    const isDifferent =
      newFormData.username !== user?.username ||
      newFormData.currentPassword !== "" ||
      newFormData.newPassword !== "" ||
      (newFormData.profilePicture &&
        newFormData.profilePicture !== user?.profilePicture);
    setHasChanges(isDifferent);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    if (formData.username) form.append("username", formData.username);
    if (formData.currentPassword && formData.newPassword) {
      form.append("password", formData.currentPassword);
      form.append("newPassword", formData.newPassword);
    }

    // Validation: Check if passwords match
    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.profilePicture)
      form.append("profilePicture", formData.profilePicture);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Unauthorized: Please log in first");
        return;
      }

      const response = await fetch(
        "http://localhost:3000/api/settings/update",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log(data);

        setUser(data.user);
        setHasChanges(false);
        setProfilePicPreview(data.user.profilePicture); // Update preview with server response
        setIsUpdated(true);

        // Reset the update feedback after 2 seconds
        setTimeout(() => setIsUpdated(false), 3000);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("Failed to update user settings");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-6">
      <button
      onClick={handleClick}
      className="bg-green-400  text-white  py-3 px-8 rounded-lg "
    >
      Go to Chat
    </button>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {user && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full border-2 border-black flex items-center justify-center mb-4 overflow-hidden">
              {profilePicPreview ? (
                <img
                  src={"http://localhost:3000" + profilePicPreview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-gray-500">No Picture?</span>
              )}
            </div>
            <button
              type="button"
              onClick={handleFileClick}
              className="text-blue-500 font-medium hover:underline">
              <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>

          {/* Username */}
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-2">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Username"
            />
          </div>

          {/* Current Password */}
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-2">
              Current Password:
            </label>
            <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Current Password"
            />
             <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="absolute right-3 top-2 text-gray-600"
              >
                {showCurrentPassword ? <FontAwesomeIcon icon="fa-solid fa-eye-slash" /> : <FontAwesomeIcon icon="fa-solid fa-eye" />}
              </button>
          </div>
          </div>

          {/* New Password */}
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-2">
              New Password:
            </label>
            <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="New Password"
            />
            <button type="button"  onClick={() => setShowNewPassword((prev) => !prev)}  className="absolute right-3 top-2 text-gray-600">
              {showNewPassword ? <FontAwesomeIcon icon="fa-solid fa-eye-slash" /> : <FontAwesomeIcon icon="fa-solid fa-eye" />}
            </button>
          </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-gray-600 font-medium mb-2 ">
              Confirm Password
            </label>
            <div className="relative">
            <input
              type={showConfirmNewPassword ? "text" : "password"}
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Confirm New Password"
            />
            <button type="button" onClick={() => setShowConfirmNewPassword((prev) => !prev)} className="absolute right-3 top-2 text-gray-600">
              {showConfirmNewPassword ? <FontAwesomeIcon icon="fa-solid fa-eye-slash" /> : <FontAwesomeIcon icon="fa-solid fa-eye" />}
            </button>
          </div>
          </div>

          {/* Submit Button */}
          <div className="w-full">
            {isUpdated && (
              <p className="text-green-500 mb-4 text-center">
                Settings updated successfully!
              </p>
            )}
            <button
              type="submit"
              disabled={!hasChanges}
              className={`w-full text-white font-medium py-2 rounded-md transition duration-200 ${
                hasChanges
                  ? "bg-blue-500 hover:bg-blue-600"
                  : isUpdated
                  ? "bg-green-500"
                  : "bg-gray-300 cursor-not-allowed"
              }`}>
              {isUpdated ? "Updated!" : "Update"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
