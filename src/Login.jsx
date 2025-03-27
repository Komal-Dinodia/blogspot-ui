import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext"; // Import AuthContext
import { Modal, Button, Form, Container, Row, Col, Spinner } from "react-bootstrap";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

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
        setModalMessage("Login Successful! Redirecting...");
        setIsSuccess(true);
        setShowModal(true);

        login(data.user, data.access);

        setTimeout(() => navigate("/"), 2000);
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


            <Button variant="primary" type="submit" className="w-100 purple-button" disabled={loading}>
              {loading ? <Spinner as="span" animation="border" size="sm" /> : "Login"}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <span style={{ color: "black" }}>No account? </span>
            <span className="text-primary" style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => navigate("/signup")}>
              Create One
            </span>
          </div>
        </Col>
      </Row>

      {/* Modal */}
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
    </Container>
  );
};

export default Login;
