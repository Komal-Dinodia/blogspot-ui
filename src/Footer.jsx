import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-auto"> {/* `mt-auto` pushes it down */}
      <p className="mb-0">&copy; {new Date().getFullYear()} BlogSpot. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
