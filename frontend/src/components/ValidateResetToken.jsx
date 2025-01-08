import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ValidateResetToken() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {

    let isMounted = true;
    
    const validateToken = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/validate-reset-password/${token}`
        );
        const data = await response.json();

         if (!response.ok) {
          if (isMounted) {  
            setError(data.error || "Invalid or expired token");
            setLoading(false);
          }
          return;
        }

        if (isMounted) {
          navigate(`/reset-password/${token}`);
        }
      } catch (err) {
        setError("An error occurred. Please try again.");
        setLoading(false);
      }
    };

    validateToken();
return () => {
      isMounted = false;
    };

  }, [token, navigate]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return null;
}