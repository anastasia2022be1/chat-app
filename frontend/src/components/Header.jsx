import { useNavigate } from "react-router-dom";
import Logout from "./Logout.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Header component represents the top navigation bar for the app.
 * It includes:
 * - The "Talki" logo on the left side (visible on larger screens).
 * - A button for navigating to the settings page.
 * - A logout button to log the user out.
 *
 * The component uses React Router's `useNavigate` hook for navigation to the settings page.
 *
 * @returns {JSX.Element} The rendered header containing the app logo, settings button, and logout button.
 */
const Header = () => {
  const navigate = useNavigate();

  /**
   * handleSettingsClick is triggered when the settings button is clicked.
   * It navigates to the settings page.
   */
  const handleSettingsClick = () => {
    navigate("/setting");
  };

  return (
    <header className="flex items-center justify-between bg-button text-white p-3 shadow-md sm:px-6 lg:px-8">
      <div className="hidden sm:flex items-center justify-center relative ">
        <div className="bg-white text-blueCustom font-bold text-lg lg:text-xl px-6 py-3 rounded-full shadow-md relative ">
          Talki
        </div>
        <div className="absolute bg-white h-4 w-4 rounded-full -bottom-2 left-4 shadow-md transform rotate-45"></div>
      </div>

      <button
        onClick={handleSettingsClick}
        aria-label="Settings"
        title="Settings">
        <FontAwesomeIcon
          icon="fa-solid fa-bars"
          className="text-xl lg:text-2xl"
        />
      </button>

      <Logout />
    </header>
  );
};

export default Header;
