import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, Container, Row, Col, Spinner } from "react-bootstrap";

const ResendVerification = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setEmail(e.target.value);

  const handleResendVerification = async (e) => {
    e.preventDefault();

    if (!email) {
      setModalMessage("Please enter your email to resend verification.");
      setIsSuccess(false);
      setShowModal(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}auth/resend/verify-email/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.status === 200) {
        setModalMessage("Verification email sent successfully.");
        setIsSuccess(true);
      } else {
        setModalMessage(data.error?.[0] || "Failed to resend email.");
        setIsSuccess(false);
      }
      setShowModal(true);
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
          <h2 className="text-center mb-4">Resend Verification Email</h2>
          <Form onSubmit={handleResendVerification} className="p-4 shadow-lg rounded bg-light">
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={handleChange} required />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? <Spinner as="span" animation="border" size="sm" /> : "Resend Email"}
            </Button>

            <div className="text-center mt-3">
              <Button variant="link" onClick={() => navigate("/login")}>Back to Login</Button>
            </div>
          </Form>
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

export default ResendVerification;
