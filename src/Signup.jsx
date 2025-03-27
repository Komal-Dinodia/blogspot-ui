import React, { useState } from "react";
import { Modal, Button, Form, Container, Row, Col, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
    first_name: "",
    last_name: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Live password match check
    if (name === "password1" || name === "password2") {
      setPasswordMatch(
        name === "password2" ? value === formData.password1 : value === formData.password2
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match before submitting
    if (!passwordMatch || formData.password1 === "" || formData.password2 === "") {
      setIsSuccess(false);
      setModalMessage("Passwords do not match.");
      setShowModal(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}auth/registration/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 201) {
        setIsSuccess(true);
        setModalMessage(
          `<strong>Check your inbox.</strong><br/><br/>
          Click the link we sent to <strong>${formData.email}</strong> to complete your account setup.`
        );
        setFormData({ username: "", email: "", password1: "", password2: "", first_name: "", last_name: "" });
      } else {
        setIsSuccess(false);
        setModalMessage(Object.values(data).flat().join("\n"));
      }
    } catch (error) {
      setIsSuccess(false);
      setModalMessage("Something went wrong! Please try again later.");
    } finally {
      setLoading(false);
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    if (isSuccess) {
      navigate("/login");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <Row className="w-100 justify-content-center">
        <Col md={5}>
          <Form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white">
            <h3 className="text-center mb-4">Create an Account</h3>

            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password1"
                value={formData.password1}
                onChange={handleChange}
                required
                isInvalid={!passwordMatch && formData.password2.length > 0}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                required
                isInvalid={!passwordMatch && formData.password2.length > 0}
              />
              <Form.Control.Feedback type="invalid">
                Passwords do not match.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" name="last_name" value={formData.last_name} onChange={handleChange} />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={loading} style={{ backgroundColor: "#782499", border: "none" }}>
              {loading ? <Spinner animation="border" size="sm" /> : "Sign Up"}
            </Button>

            <p className="text-center mt-3">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </Form>
        </Col>
      </Row>

      {/* Modal for Response Message */}
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton className={isSuccess ? "bg-success text-white" : "bg-danger text-white"}>
          <Modal.Title className="w-100 text-center">{isSuccess ? "Success" : "Error"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <p dangerouslySetInnerHTML={{ __html: modalMessage }}></p>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="primary" onClick={handleModalClose}>OK</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Signup;
