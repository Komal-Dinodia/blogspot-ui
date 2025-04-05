import React, { useState, useEffect } from "react";
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min";
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
  const [totalPages, setTotalPages] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [error, setError] = useState(null);
  const [editPost, setEditPost] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [editIsPublished, setEditIsPublished] = useState(false);

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

      const totalItems = response.data.count;
      const pageSize = response.data.results.length;
      setTotalPages(Math.ceil(totalItems / pageSize));

      const urlParams = new URLSearchParams(new URL(url).search);
      setCurrentPage(parseInt(urlParams.get("page")) || 1);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load blog posts. Please try again.");
    }
  };

  const handlePageClick = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
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
    setEditIsPublished(post.is_published || false);
    const modalElement = document.getElementById("editModal");
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  };

  const handleImageChange = (e) => setEditImage(e.target.files[0]);

  const handleEditSubmit = async () => {
    if (!editPost) return;

    try {
      const token = localStorage.getItem("access_token");
      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("description", editDescription);
      formData.append("is_published", editIsPublished);
      if (editImage) {
        formData.append("image", editImage);
      }

      await axios.put(`${API_URL}blog/edit-delete/${editPost.slug}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Show success message
      alert("Blog post updated successfully!");


      // Close the Bootstrap modal (if applicable)
      const modalElement = document.getElementById("editModal");
    
      if (modalElement) {
        modalElement.classList.remove("show");
        document.body.classList.remove("modal-open");
        modalElement.style.display = "none";

      }

      // Reset the form fields
      setEditTitle("");
      setEditDescription("");
      setEditImage(null);
      setEditPost(null);

      // Refresh the posts list
      fetchPosts(`${API_URL}api/my/blog/?page=${currentPage}`);
      setPosts([]);
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
      <div className="text-center mb-4" style={{marginTop: '15px'}}>
        <h2 className="mb-3">My Blogs</h2>
        <p className="text-muted" style={{fontSize: '1.1rem', margin: '0 auto', lineHeight: '1.6'}}>
          Welcome to your personal blogging space! Here you can manage your posts, track engagement, and refine your writing. Keep your content organized and watch your blog portfolio grow as you share your unique voice.
        </p>
        <hr style={{margin: '25px auto', border: '1px solid #000000'}} />
      </div>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      <div className="mb-4 d-flex justify-content-center">
        <div className="input-group w-50">
          <input type="text" placeholder="Search by title..." value={searchQuery} onChange={handleSearchChange} className="form-control" />
          <button className="purple-button" onClick={handleSearchSubmit}>Search</button>
        </div>
      </div>
      <div className="grid-container">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.slug} className="blog-card" onClick={() => handleReadMore(post.slug)}>
              <img src={post.image} alt={post.title} className="blog-img" />
              <div className="blog-content">
                <h5 className="blog-title">{post.title}</h5>
                <p className="text-muted small">By <strong>{post.author}</strong></p>
                <span className={`badge ${post.is_published ? "bg-success" : "bg-warning"}`}>

                  {post.is_published ? "Published" : "Unpublished"}

                </span>
                <div className="icons-row">
                  <span className="text-muted"><FaHeart className="text-danger" /></span>
                  <span className="text-muted"><FaEye className="text-primary" /> {post.views ?? 0}</span>
                  <span className="text-muted"><FaComment className="text-success" /> {post.comment_count ?? 0}</span>
                </div>
                <div className="read-more-container">
                  <button onClick={(e) => { e.stopPropagation(); handleEditClick(post); }} className="purple-button m-1">
                    <FaEdit />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleReadMore(post.slug); }} className="purple-button m-1">Read More</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(post.slug); }} className="purple-button m-1"><FaTrash /> </button>
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
        {prevPage && <button onClick={() => handlePageClick(currentPage - 1)} className="pagination-circle">&laquo;</button>}
        {nextPage && Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button key={page} onClick={() => handlePageClick(page)} className={`pagination-circle ${currentPage === page ? "active" : ""}`}>{page}</button>
        ))}
        {nextPage && <button onClick={() => handlePageClick(currentPage + 1)} className="pagination-circle">&raquo;</button>}
      </div>

        {/* Edit Modal */}
        < div className="modal fade" id="editModal" tabIndex="-1" aria-hidden="true" >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Blog Post</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <input type="text" className="form-control mb-3" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                <textarea className="form-control mb-3" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                <input type="file" className="form-control mb-3" onChange={handleImageChange} />
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" checked={editIsPublished} onChange={(e) => setEditIsPublished(e.target.checked)} />
                  <label className="form-check-label">Publish</label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="purple-button me-2" style={{backgroundColor: 'white', color: 'black'}} data-bs-dismiss="modal">Cancel</button>
                <button type="button" className="purple-button" onClick={handleEditSubmit}>Save Changes</button>

              </div>
            </div>
          </div>
        </div>
      </div>
 
  );
};
export default MyBlog;
