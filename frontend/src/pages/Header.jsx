import UserSettings from "../components/UserSettings.jsx";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const handleSettingsClick = () => {
        navigate('/settings');
    };
  return (
    <header className="flex items-center justify-between bg-blue-600 text-white p-4 shadow-md">
      <button onClick={handleSettingsClick}>
        <UserSettings />
      </button>

      <p className="text-xl font-bold tracking-wide">LOGO</p>
    </header>
  );
};

export default Header;
