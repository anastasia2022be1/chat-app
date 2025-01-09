import { Link } from "react-router-dom";
import DarkModeSwitcher from "./DarkModeSwitcher";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Navbar() {
  return (
    <nav className="bg-backgroundChat dark:bg-backgroundChatDark py-2 shadow-custom-strong border-b border-gray-300 dark:border-gray-700">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 dark:from-blue-600 dark:to-blue-700 rounded-full p-3 shadow-md">
            <Link
              to="/"
              className="text-xl font-bold text-white dark:text-gray-200"
            >
              Talki
            </Link>
          </div>
        </div>

        {/* Navigation Links */}
        <ul className="flex items-center space-x-4">
          {/* Home Link with Circular Button for Large Screens */}
          <li className="hidden lg:block">
            <Link
              to="/"
              className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 dark:from-blue-600 dark:to-blue-700 rounded-full p-3 shadow-md text-white dark:text-gray-200 hover:bg-blue-600 dark:hover:bg-blue-800 transition"
            >
              <FontAwesomeIcon icon="fa-solid fa-house" className="text-lg " />
            </Link>
          </li>

          {/* Home Icon with Circular Button for Small Screens */}
          <li className="lg:hidden">
            <Link
              to="/"
              className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 dark:from-blue-600 dark:to-blue-700 rounded-full p-3 shadow-md flex items-center justify-center text-white dark:text-gray-200 hover:bg-blue-600 dark:hover:bg-blue-800 transition"
            >
              <FontAwesomeIcon icon="fa-solid fa-house" className="text-lg" />
            </Link>
          </li>

          {/* Dark Mode Switcher Button */}
          <li>
            <div className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 dark:from-blue-600 dark:to-blue-700 rounded-full p-3 shadow-md flex items-center justify-center">
              <DarkModeSwitcher />
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}
