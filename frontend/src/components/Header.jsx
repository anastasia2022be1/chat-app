import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Header = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  // Navigate to settings page when the button is clicked
  const handleSettingsClick = () => {
    navigate("/setting");
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("userId");
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between bg-button  text-white p-3 rounded-t-xl shadow-md sm:px-6 lg:px-8">
      {/* Cloud-like Logo */}
      <div className="hidden sm:flex items-center justify-center relative ">
        <div className="bg-white text-blueCustom font-bold text-lg lg:text-xl px-6 py-3 rounded-full shadow-md relative ">
          Talki
        </div>
        {/* Cloud Tail */}
        <div className="absolute bg-white h-4 w-4 rounded-full -bottom-2 left-4 shadow-md transform rotate-45"></div>
      </div>

      {/* Settings Button */}
      <button onClick={handleSettingsClick}>
        <FontAwesomeIcon
          icon="fa-solid fa-bars"
          className="text-xl lg:text-2xl"
        />
      </button>

      {/* Logout Button */}
      <button onClick={handleLogout}>
        <FontAwesomeIcon
          icon="fa-solid fa-right-from-bracket"
          className="text-xl lg:text-2xl"
        />
      </button>
    </header>
  );
};

export default Header;
