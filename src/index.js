// index.js
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { createRoot } from "react-dom/client"; // Import createRoot from react-dom/client

const root = createRoot(document.getElementById("root")); // Create a root

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
