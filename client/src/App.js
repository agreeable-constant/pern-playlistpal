import React, { Fragment, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
} from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register.js";
import CreatePlaylist from "./components/CreatePlaylist"; // Import the CreatePlaylist component

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

  return (
    <Fragment>
      <Router>
        <div className="container">
          <Routes>
            <Route
              exact
              path="/"
              element={
                <div>
                  <h1>Welcome to the App!</h1>
                  <p>Please register or login to continue.</p>
                  <Link to="/register">Register</Link>
                  <br />
                  <Link to="/login">Login</Link>
                </div>
              }
            />
            <Route
              exact
              path="/login"
              element={
                !isAuthenticated ? (
                  <Login setAuth={setAuth} />
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />
            <Route
              exact
              path="/register"
              element={
                !isAuthenticated ? (
                  <Register setAuth={setAuth} />
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />
            <Route
              exact
              path="/dashboard"
              element={
                isAuthenticated ? (
                  <>
                    <Dashboard setAuth={setAuth} />
                    <div>
                      <Link to="/create-playlist">Create A Playlist</Link>
                    </div>
                  </>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              exact
              path="/create-playlist"
              element={
                isAuthenticated ? <CreatePlaylist /> : <Navigate to="/login" />
              }
            />
          </Routes>
        </div>
      </Router>
    </Fragment>
  );
}

export default App;
