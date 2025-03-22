import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Blog.css"; // Custom CSS

const API_URL = import.meta.env.VITE_API_URL; // API URL from .env

const Blog = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/posts/`)
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  return (
    <div className="blog-container">
      {/* Featured Blog Post */}
      {posts.length > 0 && (
        <div className="featured-post">
          <img src={posts[0].image} alt={posts[0].title} className="featured-img" />
          <div className="featured-text">
            <h2>{posts[0].title}</h2>
            <p>{posts[0].content.substring(0, 150)}...</p>
            <a href={`/post/${posts[0].id}`} className="btn btn-primary">Read More</a>
          </div>
        </div>
      )}

      {/* Blog Post Grid */}
      <div className="grid-container">
        {posts.slice(1).map((post) => (
          <div key={post.id} className="blog-card">
            <img src={post.image} alt={post.title} className="blog-img" />
            <div className="blog-content">
              <h5>{post.title}</h5>
              <p>{post.content.substring(0, 100)}...</p>
              <a href={`/post/${post.id}`} className="btn btn-outline-dark">Read More</a>
            </div>
          </div>
        ))}
      </div>
      <div className="blog-container">
        <h2>Welcome to BlogSpot</h2>
      </div>
      <div className="blog-container">
      <div className="blog-card">
        <img src="/coverimg.jpg" alt="Blog Cover" className="blog-image" />
        <h3>Sample Blog Title</h3>
        <p>This is a short description of the blog post.</p>
        <button>Read More</button>
      </div>

      <div className="blog-card">
        <img src="/coverimg.jpg" alt="Blog Cover" className="blog-image" />
        <h3>Another Blog Post</h3>
        <p>More content description here.</p>
        <button>Read More</button>
      </div>
      <div className="blog-card">
        <img src="/coverimg.jpg" alt="Blog Cover" className="blog-image" />
        <h3>Another Blog Post</h3>
        <p>More content description here.</p>
        <button>Read More</button>
      </div>
    </div>

    </div>

  );
};

export default Blog;
