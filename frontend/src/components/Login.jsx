import React, { useState } from "react";
import "../css/Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiUrl}/api/UserVerify`, {
        email,
        password,
      });

      if (response.data.success) {
        const name = response.data.data.name;
        Cookies.set("sessionEmail", email, {
          path: "/",
          secure: true,
          expires: 1,
        });
        Cookies.set("sessionName", name, {
          path: "/",
          secure: true,
          expires: 1,
        });

        navigate(`/home?sessionName=${encodeURIComponent(name)}`);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Something went wrong");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h3>Sign In</h3>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger mt-3" role="alert">
              {error}
            </div>
          )}
          <div className="input-field">
            <input
              type="email"
              id="floatingEmail"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              required
            />
          </div>
          <div className="input-field">
            <input
              type="password"
              id="floatingPassword"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
          <div className="login-options">
            <p className="mt-3 text-center">
              Don't have an account?{" "}
              <a href="/register" style={{ color: "#007bff" }}>
                Register
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;