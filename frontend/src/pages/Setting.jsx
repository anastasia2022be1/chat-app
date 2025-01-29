import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

/**
 * Settings component allows users to update their profile information,
 * including username, password, and profile picture. It also provides
 * an option to delete the account.
 *
 * @component
 * @example
 * return (
 *   <Setting />
 * )
 */
export default function Setting() {
  /**
   * Holds the user's data fetched from the server.
   * @type {Object|null}
   */
  const [user, setUser] = useState(null);

  /**
   * Holds the form data for updating user settings.
   * @type {Object}
   * @property {string} username - The user's username.
   * @property {string} currentPassword - The user's current password.
   * @property {string} newPassword - The new password to set.
   * @property {string} confirmNewPassword - Confirmation of the new password.
   * @property {File|null} profilePicture - The user's profile picture file.
   */
  const [formData, setFormData] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    profilePicture: null,
  });

  /**
   * Holds the URL of the profile picture preview.
   * @type {string|null}
   */
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  /**
   * Indicates whether there are unsaved changes in the form.
   * @type {boolean}
   */
  const [hasChanges, setHasChanges] = useState(false);

  /**
   * Holds any error message to be displayed to the user.
   * @type {string}
   */
  const [error, setError] = useState("");

  /**
   * Indicates whether the settings were successfully updated.
   * @type {boolean}
   */
  const [isUpdated, setIsUpdated] = useState(false);

  /**
   * Ref for the file input element to trigger file selection programmatically.
   * @type {React.RefObject<HTMLInputElement>}
   */
  const fileInputRef = useRef(null);

  // States for toggling password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const navigate = useNavigate();

  /**
   * Fetches the user's data from the server when the component mounts.
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
            setProfilePicPreview(null); // Set existing profile picture
          }
        }
      } catch (error) {
        setError("Failed to load user settings");
      }
    };

    fetchUserData();
  }, []);

  /**
   * Clears the error message after 4 seconds if an error is present.
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
   * Triggers the file input click event to allow the user to select a file.
   */
  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  /**
   * Navigates the user to the chat page.
   */
  const handleClick = () => {
    navigate("/chat");
  };

  /**
   * Handles changes to the form inputs and updates the form data state.
   *
   * @param {Object} e - The event object from the input change.
   * @param {EventTarget} e.target - The input element that triggered the event.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    checkForChanges(newFormData);
  };

  /**
   * Handles changes to the file input and updates the form data state.
   *
   * @param {Object} e - The event object from the file input change.
   * @param {FileList} e.target.files - The list of files selected by the user.
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newFormData = { ...formData, profilePicture: file };
      setFormData(newFormData);

      // Create a preview URL for the selected file (this is the new image before update)
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result); // Show the temporary preview
      };
      reader.readAsDataURL(file);

      checkForChanges(newFormData);
    }
  };

  /**
   * Checks if there are any changes in the form data compared to the user's current data.
   *
   * @param {Object} newFormData - The updated form data to compare.
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
   * Handles the form submission for updating user settings.
   *
   * @param {Object} e - The event object from the form submission.
   * @param {EventTarget} e.target - The form element that triggered the event.
   * @async
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only require currentPassword if newPassword is provided
    if (formData.newPassword && !formData.currentPassword) {
      setError("Please enter your current password to change the password.");
      return;
    }

    const form = new FormData();

    // Add username to the form if it's changed
    if (formData.username) form.append("username", formData.username);

    // Add the current and new passwords only if newPassword is set
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setError("Please enter your current password to change the password.");
        return;
      }

      // Validation: Check if passwords match
      if (formData.newPassword !== formData.confirmNewPassword) {
        setError("Passwords do not match!");
        return;
      }

      // Check the length of the new password
      if (formData.newPassword.length < 8) {
        setError("Password must be at least 8 characters long.");
        return;
      }

      form.append("password", formData.currentPassword);
      form.append("newPassword", formData.newPassword);
    }

    // Add profile picture to the form if changed
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
        setProfilePicPreview(null); // Reset temporary preview
        setIsUpdated(true);
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        }));

        // Reset the update feedback after 2 seconds
        setTimeout(() => setIsUpdated(false), 2000);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("Failed to update user settings");
    }
  };

  /**
   * Handles the deletion of the user's account after confirmation.
   *
   * @async
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
        localStorage.removeItem("authToken"); // Delete token
        navigate("/login"); // Redirect to login page
      } else {
        setError(data.error || "Failed to delete account.");
      }
    } catch (err) {
      setError("An error occurred while deleting your account.");
    }
  };

  return (
    <div className="max-h-screen flex flex-col items-center justify-center">
      {/* Go to Chat Button */}
      <div className="fixed bottom-12 right-5 md:bottom-18 md:right-10 z-50 flex flex-col items-center">
        <div
          onClick={handleClick}
          className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 dark:from-blue-700 dark:to-blue-800 rounded-full p-4 shadow-lg flex items-center justify-center text-white dark:text-gray-200 hover:scale-105 transition-transform duration-300">
          <FontAwesomeIcon
            icon="fa-solid fa-comments"
            className="text-md md:text-2xl"
          />
        </div>
      </div>

      {/* Settings Header */}
      <h2 className="text-2xl font-semibold text-center mb-5 mt-5 text-backgroundChatDark dark:text-textColorDark">
        <FontAwesomeIcon icon="fa-solid fa-gear" className="mr-2" />
        <span className="hidden md:inline">Settings</span>
      </h2>

      {/* Error Message */}
      {error && (
        <p className="text-center mb-4 text-error dark:text-textColorDark bg-red-100 dark:bg-errorDark rounded-lg shadow-lg px-4 py-3 flex items-center space-x-2">
          <FontAwesomeIcon
            icon="fa-solid fa-exclamation"
            className="text-xl text-error dark:text-textColorDark"
          />
          <span>{error}</span>
        </p>
      )}

      {/* Settings Form */}
      {user && (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 md:space-y-5 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg md:max-w-xl">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full border-4 border-blue-500 flex items-center justify-center mb-4 overflow-hidden shadow-lg sm:w-30 sm:h-30">
              {/* If profilePicPreview is set (new image selected), show that. Otherwise, show the current image from the server */}
              {profilePicPreview ? (
                <img
                  src={profilePicPreview} // Use the temporary preview if image is selected
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <img
                  src={
                    user?.profilePicture
                      ? "http://localhost:3000" + user.profilePicture
                      : ""
                  } // Use the current image from server if no new image
                  className="w-full h-full object-cover rounded-full"
                />
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
                className={`w-full border rounded-lg mt-2 p-3 ${
                  !formData.currentPassword && error
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blueCustom dark:bg-gray-700 dark:text-gray-200`}
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

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-title dark:text-titleDark">
              Confirm Password
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

          {/* Submit Button */}
          <div className="text-center">
            {isUpdated && (
              <p className="text-green-500 mb-4">
                Settings updated successfully!
              </p>
            )}
            <button
              type="submit"
              disabled={!hasChanges}
              className={`w-full text-black font-medium py-3 rounded-md transition duration-200 ${
                hasChanges
                  ? "bg-button hover:bg-button-600 hover:scale-105"
                  : isUpdated
                  ? "bg-green-500"
                  : "bg-gray-300 cursor-not-allowed"
              }`}>
              {isUpdated ? "Updated!" : "Update"}
            </button>
          </div>

          <div className="text-center mt-6">
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="w-full text-white bg-red-500 font-medium py-3 rounded-md hover:bg-red-600 transition duration-200">
              Delete account
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
