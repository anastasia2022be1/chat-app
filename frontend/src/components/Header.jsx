import { useNavigate } from "react-router-dom";
import Logout from "./Logout.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Header component represents the top navigation bar for the app.
 *
 * Features:
 * - **App Logo**: The "Talki" logo displayed on the left side (visible on larger screens only).
 * - **Settings Button**: A button that navigates the user to the settings page.
 * - **Logout Button**: A button to log the user out, implemented in the `Logout` component.
 *
 * This component uses the `useNavigate` hook from React Router for navigation.
 *
 * @component
 * @returns {JSX.Element} The rendered header containing the app logo, settings button, and logout button.
 */
const Header = () => {
  const navigate = useNavigate();

  /**
   * Navigates to the settings page when the settings button is clicked.
   *
   * @function
   * @returns {void}
   */
  const handleSettingsClick = () => {
    navigate("/setting");
  };

  return (
    <header className="flex items-center justify-between bg-button text-white p-3 shadow-md sm:px-6 lg:px-8">
      {/* App Logo */}
      <div className="hidden sm:flex items-center justify-center relative">
        <div className="bg-white text-blueCustom font-bold text-lg lg:text-xl px-6 py-3 rounded-full shadow-md relative">
          Talki
        </div>
        <div className="absolute bg-white h-4 w-4 rounded-full -bottom-2 left-4 shadow-md transform rotate-45"></div>
      </div>

      {/* Settings Button */}
      <button
        onClick={handleSettingsClick}
        aria-label="Settings"
        title="Settings">
        <FontAwesomeIcon
          icon="fa-solid fa-bars"
          className="text-xl lg:text-2xl"
        />
      </button>

      {/* Logout Button */}
      <Logout />
    </header>
  );
};

export default Header;
