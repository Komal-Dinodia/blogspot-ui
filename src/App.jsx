import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Blog from "./Blog";
import MyBlog from "./MyBlog";
import Footer from "./Footer";
import Signup from "./Signup";
import Login from "./Login";
import BlogDetail from "./BlogDetail"; 
import { AuthProvider } from "./AuthContext"; // Import AuthProvider

const App = () => {
  return (
    <AuthProvider> {/* ✅ Wrap the whole app inside AuthProvider */}
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <div className="container flex-grow-1 mt-4">
            <Routes>
              <Route path="/" element={<Blog />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} /> 
              <Route path="/my-blogs" element={<MyBlog />}/>
              <Route path="/post/:slug" element={<BlogDetail />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
