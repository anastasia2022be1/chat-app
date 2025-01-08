import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

export default function Layout() {
  return (
    <div className="h-screen flex flex-col bg-backgroundChat dark:bg-backgroundChatDark  ">
      {/* Header Section */}
      <header className="shadow-lg">
        <Navbar />
      </header>

      {/* Main Content Section */}
      <main className="flex-grow container mx-auto px-6  ">
        <Outlet />
      </main>

      {/* Footer Section */}
      <footer className=" bg-gray-100 dark:bg-gray-800 text-center py-2 mt-2 border-t border-gray-300 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          © 2024 My App. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
