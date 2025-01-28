import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Logout component handles the process of logging out a user.
 * - Clears authentication state by calling the `logout` function from AuthContext.
 * - Removes the stored `userId` and `authToken` from localStorage.
 * - Redirects the user to the login page after successful logout.
 *
 * @component
 * @example
 * return (
 *   <Logout />
 * )
 * @returns {JSX.Element} The rendered Logout button component with an icon.
 */
const Logout = () => {
  const navigate = useNavigate(); // Hook to navigate to different routes programmatically
  const { logout } = useContext(AuthContext); // Accessing the logout function from AuthContext

  /**
   * handleLogout function is triggered when the user clicks the logout button.
   * - Calls `logout()` to update the authentication state in the context.
   * - Removes the user credentials from localStorage.
   * - Redirects the user to the login page.
   *
   * @function
   * @returns {void}
   */
  const handleLogout = () => {
    logout(); // Clear user authentication state from the context
    localStorage.removeItem("userId"); // Remove user ID from localStorage
    localStorage.removeItem("authToken"); // Remove auth token from localStorage
    navigate("/login"); // Redirect user to login page
  };

  return (
    <button onClick={handleLogout} aria-label="Logout" title="Logout">
      <FontAwesomeIcon
        icon="fa-solid fa-right-from-bracket"
        className="text-xl lg:text-2xl"
      />
    </button>
  );
};

export default Logout;
