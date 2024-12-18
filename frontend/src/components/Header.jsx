import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

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
    <header className="flex items-center justify-between bg-blue-600 text-white p-4 shadow-md">
      <p className="text-xl font-bold tracking-wide">LOGO</p>

      <button onClick={handleSettingsClick}>Setting</button>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
};

export default Header;
