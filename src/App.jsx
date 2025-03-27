import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Blog from "./Blog";
import MyBlog from "./MyBlog";
import Footer from "./Footer";
import Signup from "./Signup";
import Login from "./Login";
import Write from "./Write";
import BlogDetail from "./BlogDetail"; 
import { AuthProvider } from "./AuthContext";
import VerifyEmail from "./VerifyEmail";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword"; // Import ResetPassword

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <div className="container flex-grow-1 mt-4">
            <Routes>
              <Route path="/" element={<Blog />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/write" element={<Write />} />
              <Route path="/my-blogs" element={<MyBlog />} />
              <Route path="/post/:slug" element={<BlogDetail />} />
              <Route path="/verify-email/:key" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:uid/:token" element={<ResetPassword />} /> {/* Added Reset Password Route */}
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
