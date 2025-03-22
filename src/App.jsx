import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Blog from "./Blog";
import Footer from "./Footer";
import Signup from "./Signup";  
import Login from "./Login";  

const App = () => {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <div className="container flex-grow-1 mt-4">
          <Routes>
            <Route path="/" element={<Blog />} />  
            <Route path="/signup" element={<Signup />} />  
            <Route path="/login" element={<Login />} />  
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
