import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/:nameFilter/:categoryFilter/:featuresFilter"
            element={<Home />}
          />
          <Route path="/:any/:any" element={<b>La url no es correcta</b>} />
          <Route path="/:any" element={<b>La url no es correcta</b>} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
