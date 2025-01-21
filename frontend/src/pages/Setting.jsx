import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

/**
 * Settings component for managing user profile settings.
 * Includes username update, password change, and profile picture update.
 */
export default function Setting() {
  /**
   * State to store user data.
   * @type {Object|null}
   */
  const [user, setUser] = useState(null);

  /**
   * State to manage form data for updating settings.
   * @type {Object}
   */
  const [formData, setFormData] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    profilePicture: null,
  });

  /**
   * State to hold the profile picture preview URL.
   * @type {string|null}
   */
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  /**
   * State to track if the form has changes.
   * @type {boolean}
   */
  const [hasChanges, setHasChanges] = useState(false);

  /**
   * State for error messages.
   * @type {string}
   */
  const [error, setError] = useState("");

  /**
   * State to track if the settings have been updated.
   * @type {boolean}
   */
  const [isUpdated, setIsUpdated] = useState(false);

  /**
   * Ref to access the file input for profile picture.
   * @type {React.RefObject<HTMLInputElement>}
   */
  const fileInputRef = useRef(null);

  /**
   * States for toggling password visibility.
   * @type {boolean}
   */
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const navigate = useNavigate();

  /**
   * Fetches the user's data on component mount.
   * Sets the profile picture preview if available.
   */
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
            setProfilePicPreview(data.profilePicture);
          }
        }
      } catch (error) {
        setError("Failed to load user settings");
      }
    };

    fetchUserData();
  }, []);

  /**
   * Clears error message after 4 seconds.
   */
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  /**
   * Triggers the file input click to allow users to select a profile picture.
   */
  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  /**
   * Navigates to the Chat page.
   */
  const handleClick = () => {
    navigate("/Chat");
  };

  /**
   * Handles changes in form fields and updates state accordingly.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Event object for form input.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    checkForChanges(newFormData);
  };

  /**
   * Handles file changes when a new profile picture is selected.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Event object for file input.
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newFormData = { ...formData, profilePicture: file };
      setFormData(newFormData);
      setProfilePicPreview(URL.createObjectURL(file)); // Update preview
      checkForChanges(newFormData);
    }
  };

  /**
   * Checks if there are any changes in the form data.
   * @param {Object} newFormData - The updated form data.
   */
  const checkForChanges = (newFormData) => {
    const isDifferent =
      newFormData.username !== user?.username ||
      newFormData.currentPassword !== "" ||
      newFormData.newPassword !== "" ||
      (newFormData.profilePicture &&
        newFormData.profilePicture !== user?.profilePicture);
    setHasChanges(isDifferent);
  };

  /**
   * Submits the form to update the user's settings.
   * @param {React.FormEvent<HTMLFormElement>} e - Form submit event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    if (formData.username) form.append("username", formData.username);
    if (formData.currentPassword && formData.newPassword) {
      form.append("password", formData.currentPassword);
      form.append("newPassword", formData.newPassword);
    }

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
        setUser(data.user);
        setHasChanges(false);
        setProfilePicPreview(data.user.profilePicture); // Update preview
        setIsUpdated(true);
        setTimeout(() => setIsUpdated(false), 3000);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("Failed to update user settings");
    }
  };

  /**
   * Deletes the user's account.
   * Prompts for confirmation before deletion.
   */
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("You are not authorized! Please login.");
        return;
      }

      const response = await fetch("http://localhost:3000/api/delete-account", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert("Your account has been successfully deleted.");
        localStorage.removeItem("authToken");
        navigate("/login");
        setError(data.error || "Failed to delete account.");
      }
    } catch (err) {
      setError("An error occurred while deleting your account.");
    }
  };

  return (
    <div className="max-h-screen flex flex-col items-center justify-center">
      {/* Settings Form */}
      {user && (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 md:space-y-5 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg md:max-w-xl">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full border-4 border-blue-500 flex items-center justify-center mb-4 overflow-hidden shadow-lg sm:w-30 sm:h-30">
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
              <FontAwesomeIcon icon="fa-solid fa-pen-to-square" /> Change Photo
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
            <label className="block text-sm font-medium text-title dark:text-titleDark">
              Username:
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg mt-2 p-3 focus:outline-none focus:ring-2 focus:ring-blueCustom dark:bg-gray-700 dark:text-gray-200"
              placeholder="Username"
            />
          </div>

          {/* Current Password */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-title dark:text-titleDark">
              Current Password:
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg mt-2 p-3 focus:outline-none focus:ring-2 focus:ring-blueCustom dark:bg-gray-700 dark:text-gray-200"
                placeholder="Current Password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="absolute right-3 top-2 text-gray-600">
                {showCurrentPassword ? (
                  <FontAwesomeIcon
                    icon="fa-solid fa-eye-slash"
                    className="mt-4"
                  />
                ) : (
                  <FontAwesomeIcon icon="fa-solid fa-eye" className="mt-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-title dark:text-titleDark">
              New Password:
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg mt-2 p-3 focus:outline-none focus:ring-2 focus:ring-blueCustom dark:bg-gray-700 dark:text-gray-200"
                placeholder="New Password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 top-2 text-gray-600">
                {showNewPassword ? (
                  <FontAwesomeIcon
                    icon="fa-solid fa-eye-slash"
                    className="mt-4"
                  />
                ) : (
                  <FontAwesomeIcon icon="fa-solid fa-eye" className="mt-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-title dark:text-titleDark">
              Confirm New Password:
            </label>
            <div className="relative">
              <input
                type={showConfirmNewPassword ? "text" : "password"}
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg mt-2 p-3 focus:outline-none focus:ring-2 focus:ring-blueCustom dark:bg-gray-700 dark:text-gray-200"
                placeholder="Confirm New Password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmNewPassword((prev) => !prev)}
                className="absolute right-3 top-2 text-gray-600">
                {showConfirmNewPassword ? (
                  <FontAwesomeIcon
                    icon="fa-solid fa-eye-slash"
                    className="mt-4"
                  />
                ) : (
                  <FontAwesomeIcon icon="fa-solid fa-eye" className="mt-4" />
                )}
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="submit"
              className={`${
                hasChanges
                  ? "bg-blue-500 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              } text-white font-medium py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blueCustom`}
              disabled={!hasChanges}>
              Save Changes
            </button>
          </div>

          {/* Error and Success Message */}
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          {isUpdated && (
            <p className="text-green-500 text-center mt-2">
              Settings updated successfully!
            </p>
          )}
        </form>
      )}
    </div>
  );
}
