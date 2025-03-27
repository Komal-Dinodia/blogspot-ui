import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaHeart, FaEye, FaComment, FaEdit, FaTrash } from "react-icons/fa";
import "./Blog.css";

const API_URL = import.meta.env.VITE_API_URL;

const MyBlog = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [error, setError] = useState(null);
  const [editPost, setEditPost] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    fetchPosts(`${API_URL}api/my/blog/?page=${currentPage}`);
  }, [search, currentPage]);

  const fetchPosts = async (url) => {
    try {
      setError(null);
      const token = localStorage.getItem("access_token");
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params: { search },
      });

      if (!response.data.results) {
        throw new Error("Invalid API response format");
      }

      setPosts(response.data.results);
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load blog posts. Please try again.");
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    setSearch(searchQuery);
    setCurrentPage(1);
  };

  const handleReadMore = async (slug) => {
    try {
      await axios.get(`${API_URL}api/blog/views/${slug}/`);
      window.location.href = `/post/${slug}`;
    } catch (error) {
      console.error("Error updating views:", error);
      window.location.href = `/post/${slug}`;
    }
  };

  const handleEditClick = (post) => {
    setEditPost(post);
    setEditTitle(post.title);
    setEditDescription(post.description);
  };

  const handleEditSubmit = async () => {
    if (!editPost) return;

    try {
      const token = localStorage.getItem("access_token");
      await axios.put(
        `${API_URL}blog/edit-delete/${editPost.slug}/`,
        { title: editTitle, description: editDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditPost(null);
      fetchPosts(`${API_URL}api/my/blog/?page=${currentPage}`);
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update the blog post.");
    }
  };

  const handleDelete = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`${API_URL}blog/edit-delete/${slug}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchPosts(`${API_URL}api/my/blog/?page=${currentPage}`);
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete the blog post.");
    }
  };

  return (
    <div className="blog-container">
      <h2 className="text-center my-4">My Blogs</h2>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      {/* Search Bar */}
      <div className="mb-4 d-flex justify-content-center">
        <div className="input-group w-50">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="form-control"
          />
          <button className="btn btn-primary purple-button" onClick={handleSearchSubmit}>
            Search
          </button>
        </div>
      </div>

      {/* Blog Grid Layout */}
      <div className="grid-container">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.slug} className="blog-card">
              <img src={post.image} alt={post.title} className="blog-img" />
              <div className="blog-content">
                <div className="blog-title-container">
                  <h5 className="blog-title">{post.title}</h5>
                  <span className="tooltip-text">{post.title}</span>
                </div>

                <p className="text-muted small">
                  By <strong>{post.author}</strong>
                </p>

                {/* Icons */}
                <div className="icons-row">
                  <span className="text-muted">
                    <FaHeart className="text-danger" /> {post.likes ?? 0}
                  </span>
                  <span className="text-muted">
                    <FaEye className="text-primary" /> {post.views ?? 0}
                  </span>
                  <span className="text-muted">
                    <FaComment className="text-success" /> {post.comment_count ?? 0}
                  </span>
                </div>

                <div className="read-more-container">
                  <button onClick={() => handleEditClick(post)} className="btn btn-warning mx-1">
                    <FaEdit /> Edit
                  </button>
                  <button onClick={() => handleReadMore(post.slug)} className="purple-button mx-1">
                    Read More
                  </button>
                  <button onClick={() => handleDelete(post.slug)} className="btn btn-danger">
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No blog posts found.</p>
        )}
      </div>

      {/* Edit Blog Modal */}
      {editPost && (
        <div className="edit-modal">
          <h4>Edit Blog</h4>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="form-control mb-2"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="form-control mb-2"
          />
          <button onClick={handleEditSubmit} className="btn btn-success">
            Save Changes
          </button>
          <button onClick={() => setEditPost(null)} className="btn btn-secondary mx-2">
            Cancel
          </button>
        </div>
      )}

      {/* Pagination */}
      <div className="text-center mt-4">
        {prevPage && (
          <button onClick={() => fetchPosts(prevPage)} className="btn btn-secondary mx-2">
            Previous
          </button>
        )}
        <span className="mx-3" style={{ color: "purple", fontWeight: "bold" }}>
          Page {currentPage}
        </span>
        {nextPage && (
          <button onClick={() => fetchPosts(nextPage)} className="btn btn-secondary mx-2">
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default MyBlog;
