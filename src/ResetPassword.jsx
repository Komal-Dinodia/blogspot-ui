import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";

const ResetPassword = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}auth/password/reset/confirm/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_password1: newPassword1, new_password2: newPassword2, uid, token }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000); // ✅ Redirect after 3s
      } else {
        setError(
          data.new_password1?.[0] || 
          data.new_password2?.[0] || 
          data.non_field_errors?.[0] || 
          "Something went wrong! Please try again."
        );
      }
    } catch (error) {
      setLoading(false);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Reset Password</h2>
        
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit} className="p-4 shadow-lg rounded bg-light">
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={newPassword1}
              onChange={(e) => setNewPassword1(e.target.value)}
              required
              disabled={message !== null} // ✅ Disable after success
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              value={newPassword2}
              onChange={(e) => setNewPassword2(e.target.value)}
              required
              disabled={message !== null} // ✅ Disable after success
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={loading || message !== null} // ✅ Disable button after success
          >
            {loading ? <Spinner as="span" animation="border" size="sm" /> : "Reset Password"}
          </Button>
        </Form>

        <div className="text-center mt-3">
          <span
            className="text-primary"
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate("/login")}
          >
            Back to Login
          </span>
        </div>
      </div>
    </Container>
  );
};

export default ResetPassword;
