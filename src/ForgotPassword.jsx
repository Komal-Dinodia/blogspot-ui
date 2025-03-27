import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}auth/password/reset/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setMessage("Password reset email has been sent. Check your inbox.");
        setEmail(""); // Clear form input after successful request
      } else {
        setError(data.detail || "Something went wrong! Please try again.");
      }
    } catch (error) {
      setLoading(false);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Forgot Password</h2>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit} className="p-4 shadow-lg rounded bg-light">
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              disabled={message !== null} // Disable input after success
            />
          </Form.Group>
          <Button 
            variant="primary" 
            type="submit" 
            className="w-100 purple-button" 
            disabled={loading || message !== null} // Disable button after success
          >
            {loading ? <Spinner as="span" animation="border" size="sm"/> : "Send Reset Link"}
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

export default ForgotPassword;
