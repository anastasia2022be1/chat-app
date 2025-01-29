import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

/**
 * `VerifyEmail` component is responsible for verifying a user's email address.
 * It fetches the verification result from the server using the token from the URL parameters.
 * If successful, it navigates to the login page with a success message.
 * If there's an error, it displays an error message and provides an option to register again.
 *
 * @component
 * @example
 * // Usage:
 * <VerifyEmail />
 *
 * @returns {JSX.Element} - A JSX element that shows loading, error, or success based on verification outcome.
 */
export default function VerifyEmail() {
  const { token } = useParams(); // Token extracted from URL params.
  const navigate = useNavigate(); // React Router hook to navigate programmatically.
  const [error, setError] = useState(null); // State to store any error messages.
  const [loading, setLoading] = useState(true); // State to track the loading status.

  /**
   * Effect hook that triggers the email verification process.
   * It sends the verification request to the server and handles success or failure.
   *
   * @async
   * @function
   * @returns {void}
   */
  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/verify/${token}`
        );
        const data = await response.json();

        if (response.ok) {
          // If verification is successful, show success message and navigate to login page.
          alert("Account successfully verified");
          navigate("/login");
        } else {
          // If verification fails, show error message.
          setError(data.error || "Verification failed");
        }
      } catch (error) {
        // Handle error if the verification request fails.
        setError("Verification failed, please try again later.");
      } finally {
        setLoading(false); // Set loading to false once the process completes.
      }
    };

    verifyAccount();
  }, [token, navigate]);

  return (
    <div className="max-h-screen flex items-center justify-center p-4">
      <div
        className="w-full max-w-md flex flex-col items-center justify-center text-center p-6 mt-36 rounded-lg shadow-lg 
        bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 ring-2 ring-gray-300 dark:ring-gray-600 space-y-4">
        {loading ? (
          // Display loading message while verification is in progress.
          <p className="text-lg font-semibold text-blue-500 dark:text-blue-400 animate-pulse">
            Loading...
          </p>
        ) : (
          <div>
            {error ? (
              // Display error message if verification fails.
              <div className="text-red-600 dark:text-red-400">
                <h2 className="text-xl font-bold mb-4">{error}</h2>
                <button
                  onClick={() => navigate("/register")}
                  className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition duration-300 ease-in-out">
                  Register
                </button>
              </div>
            ) : (
              // Display success message if verification is successful.
              <p className="text-green-600 bg-green-100 p-4 rounded-lg shadow-md ring-2 ring-green-300 dark:bg-green-900 dark:ring-green-700">
                Your account has been successfully verified.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
