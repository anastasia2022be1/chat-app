import { createContext, useState, useEffect } from "react";

/**
 * Authentication context used to manage the authentication state.
 *
 * @constant {React.Context} AuthContext - Context for storing and updating authentication state.
 */
export const AuthContext = createContext();

/**
 * Authentication provider component that provides authentication state and login/logout methods.
 *
 * @component
 * @example
 * // Example usage:
 * <AuthProvider>
 *   <YourComponent />
 * </AuthProvider>
 *
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Child components that will have access to the authentication context.
 *
 * @returns {JSX.Element} - JSX element that provides authentication context to the child components.
 */
export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(null);

  /**
   * Effect hook that checks for an authentication token in localStorage when the component is mounted.
   * If a token is found, it sets the authentication state with the token.
   *
   * @effect
   * @returns {void}
   */
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setAuthState({ token });
    }
  }, []);

  /**
   * Login function that sets the authentication state and stores the token in localStorage.
   *
   * @param {Object} userData - The user data object containing the authentication token.
   * @param {string} userData.token - The authentication token.
   *
   * @returns {void}
   */
  const login = (userData) => {
    setAuthState(userData);
    localStorage.setItem("authToken", userData.token);
  };

  /**
   * Logout function that clears the authentication state and removes the token from localStorage.
   *
   * @returns {void}
   */
  const logout = () => {
    setAuthState(null);
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
