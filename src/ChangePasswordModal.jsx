import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import "./index.css"

const ChangePasswordModal = ({ onClose }) => {
  const { token } = useContext(AuthContext);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsError(false);

    if (!token) {
      setMessage("Unauthorized: No valid token.");
      setIsError(true);
      return;
    }

    if (newPassword.length < 4) {
      setMessage("New password must be at least 4 characters long.");
      setIsError(true);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/change/password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Password changed successfully!");
        setIsError(false);
        setOldPassword("");
        setNewPassword("");
      } else {
        setMessage(data.error || "Password change failed.");
        setIsError(true);
      }
    } catch (error) {
      setMessage("Something went wrong. Try again.");
      setIsError(true);
    }
  };

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex="-1" 
      style={{ 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 1050 
      }}
    >
      <div 
        className="modal-dialog modal-dialog-centered" 
        role="document"
      >
        <div className="modal-content shadow-lg">
          <div className="modal-header border-bottom-0">
            <h5 className="modal-title w-100 text-center " style={{color:"black"}}>
              Change Password
            </h5>
            <button 
              type="button" 
              className="btn-close position-absolute" 
              style={{ right: '15px', top: '15px' }}
              onClick={onClose}
            ></button>
          </div>
          
          <div className="modal-body pt-0">
            <form onSubmit={handleChangePassword}>
              <div className="form-group mb-3">
                <label htmlFor="oldPassword" className="form-label">Current Password</label>
                <input
                  id="oldPassword"
                  type="password"
                  className="form-control"
                  placeholder="Enter current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group mb-3">
                <label htmlFor="newPassword" className="form-label">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  className="form-control"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              
              {message && (
                <div 
                  className={`alert ${isError ? 'alert-danger' : 'alert-success'} text-center`}
                  role="alert"
                >
                  {message}
                </div>
              )}
              
              <div className="d-grid">
                <button 
                  type="submit" 
                  className="btn btn-primary purple-button"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;