import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaHeart, FaEye, FaComment } from "react-icons/fa"; // Icons
import "./Blog.css";

const API_URL = import.meta.env.VITE_API_URL;

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
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

      // ✅ Calculate total pages from API response
      const totalItems = response.data.count;
      const pageSize = response.data.results.length;
      setTotalPages(Math.ceil(totalItems / pageSize));

      // Extract page number from URL
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
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleReadMore = async (slug) => {
    try {
      await axios.get(`${API_URL}api/blog/views/${slug}/`);
      window.location.href = `/post/${slug}`; // Redirect after tracking views
    } catch (error) {
      console.error("Error updating views:", error);
      window.location.href = `/post/${slug}`;
    }
  };

  const handlePageClick = (page) => {
    if (page !== currentPage) {
      fetchPosts(`${API_URL}api/blog/?page=${page}`);
    }
  };

  return (
    <div className="blog-container">
      <h2 className="text-center my-4">Welcome to BlogSpot</h2>

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
            <div
              key={post.slug}
              className="blog-card"
              onClick={() => handleReadMore(post.slug)} // Click anywhere opens post
            >
              <img src={post.image} alt={post.title} className="blog-img" />
              <div className="blog-content">
                <div className="blog-title-container">
                  <h5 className="blog-title">{post.title}</h5>
                  <span className="tooltip-text">{post.title}</span>
                </div>

                <p className="text-muted small">
                  By <strong>{post.author}</strong>
                </p>

                {/* Icons Row */}
                <div className="icons-row">
                  <span className="text-muted">
                    <FaHeart className="text-danger" /> 
                  </span>
                  <span className="text-muted">
                    <FaEye className="text-primary" /> {post.views ?? 0}
                  </span>
                  <span className="text-muted">
                    <FaComment className="text-success" /> {post.comment_count ?? 0}
                  </span>
                </div>

                {/* Read More Button */}
                <div className="read-more-container">
                  <button
                    className="purple-button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent parent click
                      handleReadMore(post.slug);
                    }}
                  >
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
      <div className="pagination-container">
        {prevPage && (
          <button onClick={() => handlePageClick(currentPage - 1)} className="pagination-circle">
            &laquo;
          </button>
        )}

        {/* Show page numbers */}
        {nextPage && Array.from({ length: totalPages}, (_, i) => i+1 ).map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`pagination-circle ${currentPage === page ? "active" : ""}`}
          >
            {page}
          </button>
        ))}

        {nextPage && (
          <button onClick={() => handlePageClick(currentPage + 1)} className="pagination-circle">
            &raquo;
          </button>
        )}
      </div>
    </div>
  );
};

export default Blog;
