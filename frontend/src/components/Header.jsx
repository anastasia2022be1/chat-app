import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Header = ({ handleMobileModus }) => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext) || {};

  const handleSettingsClick = () => {
    navigate("/setting");
  };

  const handleLogout = () => {
    if (logout) logout();
    localStorage.removeItem("userId");
    localStorage.removeItem("authToken");
    navigate("/login");
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
        onClick={handleMobileModus}
        className="lg:hidden flex items-center justify-center"
        aria-label="Mobile Menu"
        title="Mobile Menu">
        New BTN
      </button>

      <button
        onClick={handleSettingsClick}
        aria-label="Settings"
        title="Settings">
        <FontAwesomeIcon
          icon="fa-solid fa-bars"
          className="text-xl lg:text-2xl"
        />
      </button>

      <button onClick={handleLogout} aria-label="Logout" title="Logout">
        <FontAwesomeIcon
          icon="fa-solid fa-right-from-bracket"
          className="text-xl lg:text-2xl"
        />
      </button>
    </header>
  );
};

export default Header;
