import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    if (token && userId) {
      setAuthState({ token, userId });
    }

    // Flag in sessionStorage that keeps track of the current session
    if (!sessionStorage.getItem("isSession")) {
      sessionStorage.setItem("isSession", "true");

      // Event handler before closing a window/tab
      const handleBeforeUnload = () => {
        // УDeleting data from localStorage when closing a window or tab
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
      };

      // Adding an event handler
      window.addEventListener("beforeunload", handleBeforeUnload);

      // Clearing a handler when unmounting a component
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, []);

  const login = (userData) => {
    setAuthState(userData);
    localStorage.setItem("authToken", userData.token);
    localStorage.setItem("userId", userData.userId);
  };

  const logout = () => {
    setAuthState(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
