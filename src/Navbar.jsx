import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext); // Get auth state
  const [showLogout, setShowLogout] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container" style={{ maxWidth: "900px", height: "50px", padding: "10px" }}>
        <a className="navbar-brand d-flex align-items-center" href="/">
          <img src="/logo.png" alt="Logo" width="60" height="40" className="me-2" />
          <span>BlogSpot</span>
        </a>

        <div className="ms-auto d-flex align-items-center">
          {user && (
            <>
              {/* My Blogs Button */}
              <button
                className="btn btn-outline-primary me-3"
                onClick={() => navigate("/my-blogs")}
              >
                My Blogs
              </button>

              {/* Write Button */}
              <button
                className="btn btn-outline-primary me-3"
                onClick={() => navigate("/write")}

              >
                Write
              </button>
            </>
          )}

          {user ? (
            <div className="d-flex align-items-center position-relative">
              {/* Profile Circle */}
              <div
                className="rounded-circle bg-secondary d-flex justify-content-center align-items-center"
                style={{ width: "40px", height: "40px", cursor: "pointer" }}
                onClick={() => setShowLogout(!showLogout)}
              >
                <span className="text-white">{user.first_name.charAt(0).toUpperCase()}</span>

              </div>

              {/* User Name */}
              <span className="ms-2">{user.username}</span>

              {/* Logout Button (Visible on Click) */}
              {showLogout && (
                <button className="btn btn-danger ms-3" onClick={() => {
                  logout();
                  navigate("/");
                }}>
                  Logout
                </button>
              )}


            </div>
          ) : (
            <>
              <button className="btn btn-outline-primary me-2" onClick={() => navigate("/login")}>
                Login
              </button>
              <button className="btn btn-primary" onClick={() => navigate("/signup")}>
                Signup
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
