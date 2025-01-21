import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThemeContext } from "../context/ThemeContext";

/**
 * DarkModeSwitcher component allows the user to toggle between light and dark themes.
 * Depending on the current theme, it displays either a sun icon (for dark theme) or a moon icon (for light theme).
 *
 * It uses the `ThemeContext` to access the current theme and the function to toggle between themes.
 *
 * @returns {JSX.Element} A button for toggling between themes.
 */
export default function DarkModeSwitcher() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button onClick={toggleTheme}>
      {/* Show sun icon for dark mode and moon icon for light mode */}
      {theme === "light" ? (
        <FontAwesomeIcon
          icon="fa-solid fa-sun"
          className="text-xl text-white"
        />
      ) : (
        <FontAwesomeIcon
          icon="fa-solid fa-moon"
          className="text-xl text-white"
        />
      )}
    </button>
  );
}
