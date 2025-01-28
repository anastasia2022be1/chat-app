import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

/**
 * Layout component that provides a consistent structure for all pages.
 * It includes a header with a navigation bar, a main content section where child routes are rendered,
 * and a footer with copyright information.
 *
 * @component
 * @example
 * // Example usage:
 * <Layout>
 *   <YourPageComponent />
 * </Layout>
 *
 * @returns {JSX.Element} - A JSX element that contains the header, main content area, and footer.
 */
export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-backgroundChat dark:bg-backgroundChatDark">
      {/* Header Section */}
      <header className="shadow-lg">
        <Navbar />
      </header>

      {/* Main Content Section */}
      <main className="flex-grow container mx-auto px-3">
        <Outlet /> {/* Renders the nested routes */}
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-100 dark:bg-gray-800 text-center py-3 mt-6 border-t border-gray-300 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          © 2024 My App. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
