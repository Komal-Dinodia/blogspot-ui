import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, Container, Row, Col, Spinner } from "react-bootstrap";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    setLoading(false);

    if (response.status === 200) {
      setModalMessage("Login Successful! Redirecting...");
      setIsSuccess(true);
      setShowModal(true);

      setTimeout(() => {
        navigate("/"); 
      }, 2000);
    } else {
      setModalMessage(data.non_field_errors?.[0] || "Login failed. Please try again.");
      setIsSuccess(false);
      setShowModal(true);
    }
  } catch (error) {
    setLoading(false);
    setModalMessage("Something went wrong! Please try again later.");
    setIsSuccess(false);
    setShowModal(true);
  }
};

  // Forgot Password - Submit Reset Email
  const handlePasswordReset = async () => {
    if (!resetEmail) {
      setModalMessage("Please enter your email.");
      setIsSuccess(false);
      setShowModal(true);
      return;
    }
  
    setResetLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}auth/password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
  
      const data = await response.json();
      setResetLoading(false);
  
      if (response.status === 200) {
        setModalMessage("Password reset email has been sent.");
        setIsSuccess(true);
        setResetEmail(""); 
        setShowForgotPassword(false); 
      } else {
        setModalMessage(data.detail || "Failed to send reset email.");
        setIsSuccess(false);
      }
    } catch (error) {
      setResetLoading(false);
      setModalMessage("Something went wrong! Please try again later.");
      setIsSuccess(false);
    }
    setShowModal(true);
  };
  
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Row className="w-100 justify-content-center">
        <Col md={5}>
          <h2 className="text-center mb-4">Login</h2>
          <Form onSubmit={handleSubmit} className="p-4 shadow-lg rounded bg-light">
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={loading} style={{ backgroundColor: "#782499", border: "none" }}>
              {loading ? <Spinner as="span" animation="border" size="sm" /> : "Login"}
            </Button>

            {/* Forgot Password */}
            <div className="text-center mt-2">
              <span 
                className="text-primary" 
                style={{ cursor: "pointer", textDecoration: "underline" }} 
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot Password?
              </span>
            </div>
          </Form>

          {/* No Account? Create One */}
          <div className="text-center mt-3" style={{ color: "black" }}>
            <span>No account? </span>
            <span
              className="text-primary"
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => navigate("/signup")}
            >
              Create One
            </span>
          </div>
        </Col>
      </Row>

      {/* Login Response Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className={isSuccess ? "border-success" : "border-danger"}>
          <Modal.Title>{isSuccess ? "Success" : "Error"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p className={isSuccess ? "text-success" : "text-danger"}>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Forgot Password Modal */}
      <Modal show={showForgotPassword} onHide={() => setShowForgotPassword(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Enter your email to receive a reset link:</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="Enter your email" 
              value={resetEmail} 
              onChange={(e) => setResetEmail(e.target.value)} 
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowForgotPassword(false)}>Cancel</Button>
          <Button 
            variant="primary" 
            onClick={handlePasswordReset} 
            disabled={resetLoading} 
            style={{ backgroundColor: "#782499", border: "none" }}
          >
            {resetLoading ? <Spinner as="span" animation="border" size="sm" /> : "Send Reset Email"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Login;
