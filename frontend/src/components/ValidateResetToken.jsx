import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

/**
 * `ValidateResetToken` component is responsible for validating the reset password token.
 * It fetches data from the server to check if the token is valid or expired.
 * If valid, it redirects the user to the reset password page.
 * If invalid or expired, it shows an error message.
 *
 * @component
 * @example
 * // Usage:
 * <ValidateResetToken />
 *
 * @returns {JSX.Element} - A JSX element that displays loading, error, or redirects the user based on the validation result.
 */
export default function ValidateResetToken() {
  const { token } = useParams(); // Token extracted from the URL params.
  const [loading, setLoading] = useState(true); // State to track loading status.
  const [error, setError] = useState(""); // State to store any error message.
  const navigate = useNavigate(); // React Router hook to navigate programmatically.

  /**
   * Effect hook that validates the reset password token on component mount.
   * It fetches validation result from the server and navigates or shows error.
   *
   * @async
   * @function
   * @returns {void}
   */
  useEffect(() => {
    let isMounted = true; // Track if component is still mounted during async operations.

    const validateToken = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/validate-reset-password/${token}`
        );
        const data = await response.json();

        if (!response.ok) {
          // Set error message and stop loading if token is invalid or expired.
          if (isMounted) {
            setError(data.error || "Invalid or expired token");
            setLoading(false);
          }
          return;
        }

        if (isMounted) {
          // Redirect to reset password page if token is valid.
          navigate(`/reset-password/${token}`);
        }
      } catch (err) {
        setError("An error occurred. Please try again.");
        setLoading(false);
      }
    };

    validateToken();

    // Cleanup function to avoid memory leaks when component is unmounted.
    return () => {
      isMounted = false;
    };
  }, [token, navigate]);

  if (loading) {
    // Show loading state while the token is being validated.
    return <p>Loading...</p>;
  }

  if (error) {
    // Show error message if token is invalid or expired.
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  // Return null if no error and loading are displayed.
  return null;
}
