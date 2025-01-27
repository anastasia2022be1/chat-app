import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/verify/${token}`
        );
        const data = await response.json();

        if (response.ok) {
          alert("Account successfully verified");
          navigate("/login");
        } else {
          setError(data.error || "Verification failed");
        }
      } catch (error) {
        setError("Verification failed, please try again later.");
      } finally {
        setLoading(false);
      }
    };

    verifyAccount();
  }, []);

  return (
    <div
      className="max-h-screen flex items-center justify-center p-4 "
    >
      <div
        className="w-full max-w-md flex flex-col items-center justify-center text-center p-6 mt-36 rounded-lg shadow-lg 
        bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 ring-2 ring-gray-300 dark:ring-gray-600 space-y-4"
      >
        {loading ? (
          <p className="text-lg font-semibold text-blue-500 dark:text-blue-400 animate-pulse">
            Loading...
          </p>
        ) : (
          <div>
            {error ? (
              <div className="text-red-600 dark:text-red-400">
                <h2 className="text-xl font-bold mb-4">{error}</h2>
                <button
                  onClick={() => navigate("/register")}
                  className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition duration-300 ease-in-out"
                >
                  Register
                </button>
              </div>
            ) : (
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
