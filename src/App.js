import React from "react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
