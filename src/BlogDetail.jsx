import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = import.meta.env.VITE_API_URL;

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentError, setCommentError] = useState(null);
  const [newReply, setNewReply] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});

  useEffect(() => {
    fetchPost();
    fetchComments();
    checkUser();
  }, [slug]);

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

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${API_URL}api/blog/get/comment/${slug}/`);
      setComments(response.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments([]);
    }
  };

  const checkUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  };

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
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Error posting comment:", err);
      setCommentError("Failed to post comment. Please try again.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${API_URL}api/blog/delete/comment/${commentId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      fetchComments();
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    if (!newReply[commentId]?.trim()) return;

    try {
      await axios.post(
        `${API_URL}api/comment/reply/${commentId}/`,
        { comment: newReply[commentId] },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setNewReply((prev) => ({ ...prev, [commentId]: "" }));
      fetchComments();
    } catch (err) {
      console.error("Error posting reply:", err);
    }
  };

  const toggleReplies = (id) => {
    setShowReplies((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleReplyInput = (id) => {
    setShowReplyInput((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderReplies = (replies, level = 1) => {
    if (!replies || replies.length === 0) return null;

    return (
      <ul className="list-group mt-2" style={{ marginLeft: `${level * 20}px` }}>
        {replies.map((reply) => (
          <li key={reply.id} className="list-group-item">
            <strong>{reply.user}:</strong> {reply.comment}
            <br />
            <small className="text-muted">
              {new Date(reply.created_at).toLocaleString()}
            </small>

            {user && (
              <>
                <a
                  onClick={() => toggleReplyInput(reply.id)}
                  className="custom-option-link"
                >
                  Reply
                </a>

                {showReplyInput[reply.id] && (
                  <form onSubmit={(e) => handleReplySubmit(e, reply.id)} className="mt-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Write a reply..."
                      value={newReply[reply.id] || ""}
                      onChange={(e) =>
                        setNewReply((prev) => ({ ...prev, [reply.id]: e.target.value }))
                      }
                    />
                    <button type="submit" className="purple-button mt-1" style={{padding: '4px 8px', fontSize: '0.875rem'}}>Submit</button>
                  </form>
                )}
              </>
            )}

            {reply.replies && reply.replies.length > 0 && (
              <a
                className="custom-option-link"
                onClick={() => toggleReplies(reply.id)}
              >
                {showReplies[reply.id] ? "Hide Replies" : "View Replies"} ({reply.replies.length})
              </a>
            )}

            {showReplies[reply.id] && renderReplies(reply.replies, level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  const CommentComponent = ({ comment }) => {
    return (
      <li className="list-group-item">
        <div>
          <strong>{comment.user}:</strong> {comment.comment}
          <br />
          <small className="text-muted">
            {new Date(comment.created_at).toLocaleString()}
          </small>
        </div>

        {user && comment.user === user.username && (
          <a className="custom-option-link" onClick={() => handleDeleteComment(comment.id)}>
          Delete
        </a>
        )}

        {user && (
          <>
            <a
              className="custom-option-link"
              onClick={() => toggleReplyInput(comment.id)}
            >
              Reply
            </a>

            {showReplyInput[comment.id] && (
              <form onSubmit={(e) => handleReplySubmit(e, comment.id)} className="mt-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Write a reply..."
                  value={newReply[comment.id] || ""}
                  onChange={(e) =>
                    setNewReply((prev) => ({ ...prev, [comment.id]: e.target.value }))
                  }
                />
                <button type="submit" className="purple-button mt-1">Post Reply</button>
              </form>
            )}
          </>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <a
            className="custom-option-link"
            onClick={() => toggleReplies(comment.id)}
          >
            {showReplies[comment.id] ? "Hide Replies" : "View Replies"} ({comment.replies.length})
          </a>
        )}

        {showReplies[comment.id] && renderReplies(comment.replies)}
      </li>
    );
  };

  if (loading) return <div className="text-center my-5">Loading...</div>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">{post.title}</h2>
      <img src={post.image} alt={post.title} className="w-100 mb-4 rounded" />
      <p><strong>By {post.author}</strong></p>

      <div dangerouslySetInnerHTML={{ __html: post.description }} className="blog-content" />

      <div className="d-flex justify-content-between mt-3">
        <span className="text-muted"><strong>Views:</strong> {post.views}</span>
        <span className="text-muted"><strong>Comments:</strong> {comments.length}</span>
      </div>

      <div className="mt-5">
        <h4>Comments</h4>

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
            <button type="submit" className="purple-button mt-2">Post Comment</button>
          </form>
        ) : (
          <p className="text-muted">You must be logged in to post a comment.</p>
        )}

        {comments.length > 0 ? (
          <ul className="list-group">
            {comments.map((comment) => (
              <CommentComponent key={comment.id} comment={comment} />
            ))}
          </ul>
        ) : (
          <p className="text-muted">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;
