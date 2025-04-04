import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = import.meta.env.VITE_API_URL;
const REPLY_API_URL = "http://103.206.101.251:8003/api/comment/reply/";

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentError, setCommentError] = useState(null);
  const [replies, setReplies] = useState({});
  const [newReply, setNewReply] = useState({});


  useEffect(() => {
    fetchPost();
    fetchComments();
    checkUser();
    fetchReplies();
    handleReplySubmit();
  }, [slug]);

  const fetchReplies = async (commentId) => {
    try {
      const response = await axios.get(`${REPLY_API_URL}${commentId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setReplies((prevReplies) => ({
        ...prevReplies,
        [commentId]: response.data,
      }));
    } catch (err) {
      console.error(`Error fetching replies for comment ${commentId}:`, err);
    }
  };

  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    if (!newReply[commentId]?.trim()) return;

    try {
      await axios.post(
        `${REPLY_API_URL}${commentId}/`,
        { reply: newReply[commentId] },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setNewReply((prevReplies) => ({ ...prevReplies, [commentId]: "" })); // Clear input
      fetchReplies(commentId); // Refresh replies
    } catch (err) {
      console.error("Error posting reply:", err);
    }
  };

  // Fetch blog post details
  const fetchPost = async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await axios.get(`${API_URL}api/blog/${slug}/`, {
        withCredentials: true,
      });

      setPost(response.data);
    } catch (err) {
      console.error("Error fetching blog details:", err);
      setError("Failed to load blog post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch comments for the post
  const fetchComments = async () => {
    try {
      const response = await axios.get(`${API_URL}api/blog/get/comment/${slug}/`);
      setComments(response.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments([]);
    }
  };

  // Check if the user is logged in
  const checkUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("Logged-in user:", parsedUser); // Debugging
      setUser(parsedUser);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setCommentError(null);
      await axios.post(
        `${API_URL}api/blog/create/comment/${slug}/`,
        { comment: newComment },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setNewComment(""); // Clear input after submission
      fetchComments(); // Refresh comments list
    } catch (err) {
      console.error("Error posting comment:", err);
      setCommentError("Failed to post comment. Please try again.");
    }
  };

  // Handle deleting a comment
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${API_URL}api/blog/delete/comment/${commentId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      fetchComments(); // Refresh comments list
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  if (loading) {
    return <div className="text-center my-5">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }
  function CommentComponent({ comment, fetchReplies }) {
    const [showReplies, setShowReplies] = useState(false);

    const handleToggleReplies = () => {
      if (!showReplies) {
        fetchReplies(comment.id);
      }
      setShowReplies(!showReplies);
    };

    return (
      <div className="container my-5">
        <h2 className="text-center mb-4">{post.title}</h2>
        <img src={post.image} alt={post.title} className="w-100 mb-4 rounded" />
        <p><strong>By {post.author}</strong></p>

        {/* Render HTML content safely */}
        <div dangerouslySetInnerHTML={{ __html: post.description }} className="blog-content" />

        <div className="d-flex justify-content-between mt-3">
          <span className="text-muted"><strong>Views:</strong> {post.views}</span>
          <span className="text-muted"><strong>Comments:</strong> {comments.length}</span>
        </div>

        {/* Comment Section */}
        <div className="mt-5">
          <h4>Comments</h4>

          {/* Comment Input for Logged-in Users */}
          {user ? (
            <form onSubmit={handleCommentSubmit} className="mb-4">
              <textarea
                className="form-control"
                placeholder="Write a comment..."
                rows="3"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              {commentError && <div className="text-danger mt-2">{commentError}</div>}
              <button type="submit" className="btn btn-primary mt-2 purple-button">Post Comment</button>
            </form>
          ) : (
            <p className="text-muted">You must be logged in to post a comment.</p>
          )}

          {/* Display Comments */}
          {comments.length > 0 ? (
            <ul className="list-group">
              {comments.map((comment) => (
                <li key={comment.id} className="list-group-item">
                  <div>
                    <strong>{comment.user}:</strong> {comment.comment}
                    <br />
                    <small className="text-muted">
                      {new Date(comment.created_at).toLocaleString()}
                    </small>
                  </div>

                  {/* Show delete button for the comment owner */}
                  {user && comment.user === user.username && (
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteComment(comment.id)}>
                      🗑️ Delete
                    </button>
                  )}

                  {/* Replies Section */}
                    <div>
                      <button
                        className="btn btn-sm"
                        style={{ color: '#007BFF' }} // Change text color here
                        onClick={handleToggleReplies}
                      >
                        {showReplies ? "Hide Replies" : "View Replies"}
                      </button>

                      {showReplies && (
                        <div className="replies-container">
                          {/* your replies rendering logic here */}
                        </div>
                      )}
                    </div>

                  {replies[comment.id] && (
                    <ul className="list-group mt-2">
                      {replies[comment.id].map((reply) => (
                        <li key={reply.id} className="list-group-item">
                          <strong>{reply.user}:</strong> {reply.reply}
                          <br />
                          <small className="text-muted">{new Date(reply.created_at).toLocaleString()}</small>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Reply Form */}
                  {user && (
                    <form onSubmit={(e) => handleReplySubmit(e, comment.id)} className="mt-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Write a reply..."
                        value={newReply[comment.id] || ""}
                        onChange={(e) =>
                          setNewReply((prevReplies) => ({
                            ...prevReplies,
                            [comment.id]: e.target.value,
                          }))
                        }
                      />
                      <button type="submit" className="btn btn-sm btn-primary mt-1">
                        Reply
                      </button>
                    </form>
                  )}
                </li>
              ))}
            </ul>

          ) : (
            <p className="text-muted">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    );
  };
}
  export default BlogDetail;
 