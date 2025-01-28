import { createContext, useState, useEffect } from "react";

/**
 * Theme context used to manage the current theme (light or dark) across the application.
 *
 * @constant {React.Context} ThemeContext - Context for storing and updating the theme state.
 */
export const ThemeContext = createContext();

/**
 * Theme provider component that provides the current theme and a method to toggle between light and dark themes.
 * It also handles saving the selected theme in localStorage and applying it when the component mounts.
 *
 * @component
 * @example
 * // Example usage:
 * <ThemeProvider>
 *   <YourComponent />
 * </ThemeProvider>
 *
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Child components that will have access to the theme context.
 *
 * @returns {JSX.Element} - JSX element that provides theme context to the child components.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  /**
   * Effect hook that checks for a saved theme in localStorage when the component is mounted.
   * It applies the saved theme to the document's root element and sets the theme state.
   *
   * @effect
   * @returns {void}
   */
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.add(savedTheme);
  }, []);

  /**
   * Function to toggle between light and dark themes.
   * It updates the theme state, saves the new theme in localStorage,
   * and applies the new theme to the document's root element.
   *
   * @returns {void}
   */
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme); // Update theme state
    localStorage.setItem("theme", newTheme); // Save theme in localStorage
    document.documentElement.classList.remove(theme); // Remove old theme class
    document.documentElement.classList.add(newTheme); // Add new theme class
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
