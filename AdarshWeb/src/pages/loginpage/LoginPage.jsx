import React, { useState } from "react";
import "./loginPage.css";

const API_BASE_URL = "https://api.adarsh.store";

export default function Auth() {
  const [mode, setMode] = useState("login"); // login | register
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  const submit = async () => {
    if (!email || !password || (!isLogin && !name)) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          isLogin
            ? { email, password }
            : { name, email, password }
        ),
      });

      // Handle non-JSON errors (CORS / proxy issues)
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        alert(data.message || "Authentication failed");
        return;
      }

      if (isLogin) {
        if (!data.token) {
          throw new Error("Token missing from response");
        }
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      } else {
        alert(`Account created successfully, ${name}!`);
        setMode("login");
        setName("");
        setPassword("");
      }
    } catch (err) {
      console.error("Auth error:", err);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="header">
          <h1>{isLogin ? "Welcome back" : "Create account"}</h1>
          <p>
            {isLogin
              ? "Sign in to continue"
              : "Start your journey with us"}
          </p>
        </div>

        <div className="form">
          {!isLogin && (
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="primary-btn"
            onClick={submit}
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </button>

          <div className="switch">
            <span>
              {isLogin
                ? "Don’t have an account?"
                : "Already have an account?"}
            </span>
            <button
              className="link-btn"
              onClick={() =>
                setMode(isLogin ? "register" : "login")
              }
            >
              {isLogin ? "Create account" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}