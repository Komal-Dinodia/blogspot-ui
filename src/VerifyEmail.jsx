import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const { key } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying...");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    let isMounted = true; // Prevent API from triggering twice

    const verifyEmail = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/auth/registration/verify-email/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key }),
        });

        if (isMounted) {
          if (response.ok) {
            setStatus("Email verified successfully!");
          } else {
            setStatus("Invalid or expired verification link.");
          }
          setShowPopup(true); // Show popup after response
        }
      } catch (error) {
        if (isMounted) {
          setStatus("An error occurred. Please try again.");
          setShowPopup(true);
        }
      }
    };

    verifyEmail();

    return () => {
      isMounted = false; // Cleanup to prevent re-triggering
    };
  }, [key]);

  return (
    <div className="flex justify-center items-center h-screen">
      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-4">{status}</h2>
            <button 
              className="purple-button btn"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
