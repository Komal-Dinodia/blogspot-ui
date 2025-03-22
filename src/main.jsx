import "bootstrap/dist/css/bootstrap.min.css"; 
 
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const API_URL = import.meta.env.VITE_API_URL;
console.log("API URL:", API_URL); // Debugging: Make sure the URL is correct

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
