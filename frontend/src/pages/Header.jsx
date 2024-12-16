import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  // Navigate to settings page when the button is clicked
  const handleSettingsClick = () => {
    navigate("/setting");
  };
  return (
    <header className="flex items-center justify-between bg-blue-600 text-white p-4 shadow-md">
      <button onClick={handleSettingsClick}>Setting</button>

      <p className="text-xl font-bold tracking-wide">LOGO</p>
    </header>
  );
};

export default Header;
