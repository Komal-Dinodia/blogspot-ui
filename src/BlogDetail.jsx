import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = import.meta.env.VITE_API_URL;

const BlogDetail = () => {
  const { slug } = useParams(); // Get slug from URL
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setError(null);
        setLoading(true);

        const response = await axios.get(`${API_URL}api/blog/${slug}/`, {
          withCredentials: true, // Ensures cookies (like session ID, CSRF token) are sent
        });

        setPost(response.data);
      } catch (err) {
        console.error("Error fetching blog details:", err);
        setError("Failed to load blog post. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return <div className="text-center my-5">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">{post.title}</h2>
      <img src={post.image} alt={post.title} className="w-100 mb-4 rounded" />
      <p><strong>By {post.author}</strong></p>

      {/* Render HTML content safely */}
      <div dangerouslySetInnerHTML={{ __html: post.description }} className="blog-content" />

      <div className="d-flex justify-content-between mt-3">
        <span className="text-muted"><strong>Likes:</strong> {post.likes}</span>
        <span className="text-muted"><strong>Views:</strong> {post.views}</span>
        <span className="text-muted"><strong>Comments:</strong> {post.comment_count}</span>
      </div>
    </div>
  );
};

export default BlogDetail;
