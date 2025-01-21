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
 * @returns {JSX.Element} The rendered Logout button component.
 */
const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  /**
   * handleLogout function is triggered when the user clicks the logout button.
   * - Calls `logout()` to update the authentication state in the context.
   * - Removes the user credentials from localStorage.
   * - Redirects the user to the login page.
   */
  const handleLogout = () => {
    logout();
    localStorage.removeItem("userId");
    localStorage.removeItem("authToken");
    navigate("/login");
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
