import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import CreatePlaylist from "./components/CreatePlaylist";
import EditPlaylist from "./components/EditPlaylist";
import { AuthProvider } from "./AuthContext";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthenticated = async () => {
    try {
      const res = await fetch("http://localhost:5000/authentication/verify", {
        method: "POST",
        headers: { jwt_token: localStorage.token },
      });

      const parseRes = await res.json();

      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    checkAuthenticated();
  }, []);
  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  const AuthenticatedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  const UnauthenticatedRoute = ({ children }) => {
    return !isAuthenticated ? children : <Navigate to="/dashboard" />;
  };

  return (
    <Router>
      <div className="container">
      <AuthProvider>

        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<UnauthenticatedRoute><Login setAuth={setAuth} /></UnauthenticatedRoute>} />
          <Route path="/register" element={<UnauthenticatedRoute><Register setAuth={setAuth} /></UnauthenticatedRoute>} />
          <Route path="/dashboard" element={<AuthenticatedRoute><Dashboard setAuth={setAuth} /></AuthenticatedRoute>} />
          <Route path="/create-playlist" element={<AuthenticatedRoute><CreatePlaylist /></AuthenticatedRoute>} />
          <Route path="/edit-playlist/:playlistId" element={<AuthenticatedRoute><EditPlaylist /></AuthenticatedRoute>} />
        </Routes>
        </AuthProvider>

      </div>
    </Router>
  );
}

const Welcome = () => (
  <div>
    <h1>Welcome to the App!</h1>
    <p>Please register or login to continue.</p>
    <Link to="/register">Register</Link>
    <br />
    <Link to="/login">Login</Link>
  </div>
);

export default App;
