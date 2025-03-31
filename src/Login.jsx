import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext"; 
import { Button, Form, Container, Row, Col, Spinner } from "react-bootstrap";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/"); // Redirect to home if token exists
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false);

      if (response.status === 200) {
        login(data.user, data.access);
        navigate("/");
      } else {
        alert(data.non_field_errors?.[0] || "Login failed. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      alert("Something went wrong! Please try again later.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Row className="w-100 justify-content-center">
        <Col md={5}>
          <h2 className="text-center mb-4">Login</h2>
          <Form onSubmit={handleSubmit} className="p-4 shadow-lg rounded bg-light">
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
            </Form.Group>

            <div className="d-flex justify-content-center mb-3">
              <span
                className="text-primary text-center"
                style={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={() => navigate("/forgot-password")}
              >
                Reset or Forgot Password?
              </span>
            </div>

            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? <Spinner as="span" animation="border" size="sm" /> : "Login"}
            </Button>

            <div className="text-center mt-3">
              <span style={{ color: "black" }}>No account? </span>
              <span className="text-primary" style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => navigate("/signup")}>
                Create One
              </span>
            </div>

            <div className="text-center mt-3">
              <Button variant="link" onClick={() => navigate("/resend-verification")}>
                Resend Verification Email
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
