import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import ChangePasswordModal from "./ChangePasswordModal"; // Import new component

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [showLogout, setShowLogout] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false); // Toggle modal

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container" style={{ maxWidth: "100%", height: "50px", padding: "10px" }}>
        <a className="navbar-brand d-flex align-items-center" href="/" style={{marginLeft: '20px'}}>
          {/* <img src="/logo.png" alt="Logo" width="60" height="40" className="me-2" /> */}
          <span style={{fontSize: '24px', fontWeight: '600'}}>BlogSpot</span>
        </a>

        <div className="ms-auto d-flex align-items-center">
          {user && (
            <>
              <button className="purple-button mt-3 mb-3 m-1" onClick={() => navigate("/my-blogs")}>
                My Blogs
              </button>
              <button className="purple-button mt-3 mb-3 m-1" onClick={() => navigate("/write")}>
                Write
              </button>
            </>
          )}

          {user ? (
            <div className="d-flex align-items-center position-relative">
              <div
                className="rounded-circle bg-secondary d-flex justify-content-center align-items-center"
                style={{ width: "40px", height: "40px", cursor: "pointer" }}
                onClick={() => setShowLogout(!showLogout)}
              >
                <span className="text-white">{user.first_name.charAt(0).toUpperCase()}</span>
              </div>
              <span className="ms-2">{user.username}</span>

              {showLogout && (
                <div className="d-flex flex-row ms-3">
                  <button className="purple-button mt-3 mb-3 m-1" onClick={() => { logout(); navigate("/"); }}>
                    Logout
                  </button>
                  <button className="purple-button mt-3 mb-3 m-1" onClick={() => setShowChangePassword(true)}>
                    Change Password
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="purple-button me-2" style={{backgroundColor: 'transparent', color: 'white', border: '1px solid white'}} onClick={() => navigate("/login")}>
                Login
              </button>
              <button className="purple-button" onClick={() => navigate("/signup")}>
                Signup
              </button>
            </>
          )}
        </div>
      </div>

      {/* Render Change Password Modal */}
      {showChangePassword && <ChangePasswordModal onClose={() => setShowChangePassword(false)} />}
    </nav>
  );
};

export default Navbar;
