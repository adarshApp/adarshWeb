import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./loginPage.css";
import { API_BASE_URL } from "../../config/api";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 If already logged in, skip login page
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/onboarding", { replace: true });
    }
  }, [navigate]);

  const submit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      if (!data.token) {
        throw new Error("Token missing in response");
      }

      // ✅ Save token
      localStorage.setItem("token", data.token);

      // ✅ Redirect to onboarding
      navigate("/onboarding", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="greeting-wrapper">
      <div className="login-container pin-card">
        <div className="pin blue-pin"></div>

        <div className="auth-header">
          <div className="auth-icon-box">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
            </svg>
          </div>
          <h3>Sign in with email</h3>
          <p>
            Make a new doc to bring your words, data, and teams together. For
            free.
          </p>
        </div>

        <form className="auth-form" onSubmit={submit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="forgot-password">
            <span>Forgot password?</span>
          </div>

          <button
            type="submit"
            className="greeting-continue-btn auth-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Get Started"}
          </button>
        </form>

        <div className="auth-divider">
          <span>Or sign in with</span>
        </div>

        <div className="social-grid">
          <button className="social-btn">Google</button>
          <button className="social-btn">Facebook</button>
          <button className="social-btn">Apple</button>
        </div>
      </div>

      <div className="greeting-text">
        Ebolt <span>Cloud Engine</span>
      </div>
    </div>
  );
};

export default LoginPage;