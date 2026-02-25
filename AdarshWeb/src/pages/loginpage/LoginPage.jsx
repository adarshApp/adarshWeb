import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./loginPage.css";
import { API_BASE_URL } from "../../config/api";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ----------------------------------------
     AUTO REDIRECT IF ALREADY LOGGED IN
  ---------------------------------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const onboardingDone = localStorage.getItem("onboardingCompleted");

    if (token) {
      if (onboardingDone === "true") {
        navigate("/home", { replace: true });
      } else {
        navigate("/onboarding", { replace: true });
      }
    }
  }, [navigate]);

  /* ----------------------------------------
     LOGIN SUBMIT
  ---------------------------------------- */
  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        return;
      }

      /* ----------------------------------------
         EXPECTED BACKEND RESPONSE
      ---------------------------------------- */
      const { token, user } = data;

      if (!token || !user) {
        throw new Error("Invalid login response");
      }

      /* ----------------------------------------
         SAVE AUTH METADATA
      ---------------------------------------- */
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user._id);
      localStorage.setItem("email", user.email);
      localStorage.setItem(
        "onboardingCompleted",
        String(user.onboardingCompleted)
      );

      if (user.board) localStorage.setItem("board", user.board);
      if (user.classLevel)
        localStorage.setItem("classLevel", user.classLevel);

      /* ----------------------------------------
         REDIRECT BASED ON ONBOARDING
      ---------------------------------------- */
      if (user.onboardingCompleted) {
        navigate("/home", { replace: true });
      } else {
        navigate("/onboarding", { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again.");
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
          <p>Access your learning dashboard securely.</p>
        </div>

        <form className="auth-form" onSubmit={submit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

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