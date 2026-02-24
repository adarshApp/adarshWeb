import React from 'react';
import './loginPage.css'; // Ensure your CSS file is imported

const LoginPage = () => {
  return (
    <div className="greeting-wrapper">
      <div className="login-container pin-card">
        {/* Decorative Hardware Pin */}
        <div className="pin blue-pin"></div>

        {/* Brand/Icon Header */}
        <div className="auth-header">
          <div className="auth-icon-box">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"/>
             </svg>
          </div>
          <h3>Sign in with email</h3>
          <p>Make a new doc to bring your words, data, and teams together. For free.</p>
        </div>

        {/* Form Fields */}
        <form className="auth-form">
          <div className="input-group">
            <input type="email" placeholder="Email" required />
          </div>
          <div className="input-group">
            <input type="password" placeholder="Password" required />
          </div>
          
          <div className="forgot-password">
            <span>Forgot password?</span>
          </div>

          <button type="submit" className="greeting-continue-btn auth-submit">
            Get Started
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>Or sign in with</span>
        </div>

        {/* Social Buttons */}
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