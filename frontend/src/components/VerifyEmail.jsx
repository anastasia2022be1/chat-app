import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {error ? (
            <div>
              <h2>{error}</h2>
              <button onClick={() => navigate("/register")}>Register</button>
            </div>
          ) : (
            <p>Your account has been successfully verified.</p>
          )}
        </div>
      )}
    </div>
  );
}
