import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Spinner } from "react-bootstrap";

const Write = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      return;
    }

    const style = document.createElement("style");
    style.innerHTML = `
      .cke_notification_warning {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    const script = document.createElement("script");
    script.src = "https://cdn.ckeditor.com/4.21.0/full/ckeditor.js";
    script.async = true;
    script.onload = () => {
      if (window.CKEDITOR) {
        window.CKEDITOR.replace("editor", {
          removePlugins: "resize",
          toolbar: [
            ["Styles", "Format"],
            ["Bold", "Italic", "Underline", "Strike"],
            ["Undo", "Redo"],
            ["Link", "Unlink"],
            ["Image", "Table"],
            ["NumberedList", "BulletedList"],
            ["Source"],
          ],
          height: 300,
        });

        window.CKEDITOR.instances.editor.on("change", function () {
          setFormData((prevData) => ({
            ...prevData,
            description: window.CKEDITOR.instances.editor.getData(),
          }));
        });
      }
    };

    document.body.appendChild(script);
  }, [accessToken, navigate]);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/create/blog/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();
      setLoading(false);

      if (response.status === 201) {
        setMessage({ type: "success", text: "Post created successfully!" });
        setTimeout(() => navigate("/my-blogs"), 2000);
      } else {
        setMessage({ type: "error", text: data.title || `Description: ${data.description}` || "Failed to create post." });
      }
    } catch (error) {
      setLoading(false);
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Create a New Post</h2>
      {message && <p className={`text-${message.type === "success" ? "success" : "danger"}`}>{message.text}</p>}

      <Form onSubmit={handleSubmit} className="p-4 shadow-lg rounded bg-light">
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description:</Form.Label>
          <textarea id="editor" name="description" required></textarea>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Upload Image</Form.Label>
          <Form.Control type="file" name="image" onChange={handleChange} />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100 purple-button" disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" /> : "Publish Post"}
        </Button>
      </Form>
    </Container>
  );
};

export default Write;

