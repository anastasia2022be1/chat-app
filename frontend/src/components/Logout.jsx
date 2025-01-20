import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("userId");
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} aria-label="Logout" title="Logout">
      <FontAwesomeIcon
        icon="fa-solid fa-right-from-bracket"
        className="text-xl lg:text-2xl"
      />
    </button>
  );
};

export default Logout;
