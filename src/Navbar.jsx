import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  const navigate = useNavigate();

  // Function to check if the user is logged in
  const isAuthenticated = () => {
    return localStorage.getItem("access_token") !== null;
  };

  // Handle the Write button click
  const handleWriteClick = () => {
    if (isAuthenticated()) {
      navigate("/write");  
    } else {
      navigate("/login"); 
    }
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container" style={{ maxWidth: "900px", height: "50px", padding: "20px" }}>
        <a className="navbar-brand d-flex align-items-center" href="/">
          <img src="/logo.png" alt="Logo" width="60" height="40" className="me-2" />
          <span>BlogSpot</span>
        </a>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button className="btn btn-outline-secondary nav-link" onClick={handleWriteClick}>
                Write
              </button>
            </li>
            <li className="nav-item">
              <button className="btn btn-outline-primary nav-link" onClick={() => navigate("/login")}>
                Login
              </button>
            </li>
            <li className="nav-item">
              <button className="btn btn-primary nav-link text-white" onClick={() => navigate("/signup")}>
                Signup
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
