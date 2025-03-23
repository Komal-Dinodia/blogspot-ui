import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaHeart, FaEye, FaComment } from "react-icons/fa"; // Import icons
import "./Blog.css";

const API_URL = import.meta.env.VITE_API_URL;

const MyBlog = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, [search, currentPage]);

  const fetchPosts = async () => {
    try {
      setError(null);
      const response = await axios.get(`${API_URL}api/blog/`, {
        params: { search, page: currentPage },
      });

      if (!response.data.results) {
        throw new Error("Invalid API response format");
      }

      setPosts(response.data.results);
      setTotalPages(Math.ceil(response.data.count / response.data.results.length));
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

  return (
    <div className="blog-container">
      <h2 className="text-center my-4">Your Blogs</h2>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      {/* Search Bar with Button */}
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

                {/* Icons Row - Fixed Position */}
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
                  <a href={`/post/${post.slug}`} className="purple-button">
                    Read More
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No blog posts found.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="text-center mt-4">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn-secondary mx-2"
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`btn mx-1 ${currentPage === index + 1 ? "btn-primary" : "btn-outline-secondary"}`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn btn-secondary mx-2"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MyBlog;
