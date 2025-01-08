import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThemeContext } from "../context/ThemeContext";

export default function DarkModeSwitcher() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button onClick={toggleTheme}>
      {/* Show sun icon for dark mode and moon icon for light mode */}
      {theme === "light" ? (
        <FontAwesomeIcon icon="fa-solid fa-sun" className="text-xl text-white" />
      ) : (
        <FontAwesomeIcon icon="fa-solid fa-moon" className="text-xl text-white" />
      )}
    </button>
  );
}
