import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAddressBook,
  faBars,
  faCamera,
  faComments,
  faExclamation,
  faEye,
  faEyeSlash,
  faGear,
  faHouse,
  faInfoCircle,
  faMagnifyingGlass,
  faMoon,
  faPenToSquare,
  faRightFromBracket,
  faSun,
  faTrash,
  faUserGroup,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-regular-svg-icons";

library.add(
  faAddressBook,
  faBars,
  faCamera,
  faComment,
  faComments,
  faExclamation,
  faEye,
  faEyeSlash,
  faGear,
  faHouse,
  faInfoCircle,
  faMagnifyingGlass,
  faMoon,
  faPenToSquare,
  faRightFromBracket,
  faSun,
  faTrash,
  faUserGroup,
  faUserPlus
);

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
