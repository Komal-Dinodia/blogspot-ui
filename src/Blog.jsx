import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaHeart, FaEye, FaComment } from "react-icons/fa"; // Import icons
import "./Blog.css";

const API_URL = import.meta.env.VITE_API_URL;

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [search, setSearch] = useState("");
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts(`${API_URL}api/blog/?page=${currentPage}`);
  }, [search, currentPage]);

  const fetchPosts = async (url) => {
    try {
      setError(null);
      const response = await axios.get(url, { params: { search } });

      if (!response.data.results) {
        throw new Error("Invalid API response format");
      }

      setPosts(response.data.results);
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);

      // Extract page number from "next" or "previous" URL
      const urlParams = new URLSearchParams(new URL(url).search);
      setCurrentPage(parseInt(urlParams.get("page")) || 1);
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
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleReadMore = async (slug) => {
    try {
      await axios.get(`${API_URL}api/blog/views/${slug}/`);
      window.location.href = `/post/${slug}`; // Redirect after updating views
    } catch (error) {
      console.error("Error updating views:", error);
      window.location.href = `/post/${slug}`; // Still navigate even if API fails
    }
  };

  return (
    <div className="blog-container">
      <h2 className="text-center my-4">Welcome to BlogSpot</h2>

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
                  <button onClick={() => handleReadMore(post.slug)} className="purple-button">
                    Read More
                  </button>
                </div>

              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No blog posts found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="text-center mt-4">
        {prevPage && (
          <button
            onClick={() => fetchPosts(prevPage)}
            className="btn btn-secondary mx-2"
          >
            Previous
          </button>
        )}

        {/* Show Current Page */}
        <span className="mx-3" style={{ color: "purple", fontWeight: "bold" }}>Page {currentPage}</span>

        {nextPage && (
          <button
            onClick={() => fetchPosts(nextPage)}
            className="btn btn-secondary mx-2"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Blog;
