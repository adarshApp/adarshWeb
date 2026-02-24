import React from 'react';
import './homePage.css'; // See the CSS below

const HomePage = () => {
  return (
    <div className="home-wrapper">
      {/* Decorative Floating Elements */}
      <div className="floating-item paperclip-top" aria-hidden="true">📎</div>
      <div className="floating-item binder-clip-top" aria-hidden="true">📌</div>
      
      <main className="hero-container">
        {/* The Sticky Note Section */}
        <div className="sticky-note-wrapper">
          <div className="sticky-note">
            <p className="handwritten-text">
              Everything's <br /> looking great! <br /> <span>Thanks!</span>
            </p>
          </div>
          <div className="sticky-shadow"></div>
        </div>

        {/* Headline */}
        <h1 className="hero-title">
          Get started with Acctual's <br /> 
          <span>accounts payable today</span>
        </h1>

        {/* CTA Input Group */}
        <div className="cta-group">
          <input 
            type="email" 
            placeholder="Enter your work email" 
            className="cta-input" 
          />
          <button className="cta-button">See a demo</button>
        </div>

        {/* Footer Branding */}
        <footer className="hero-footer">
          <p>Powered by <span className="logo-text"><strong>G</strong> Acctual</span></p>
        </footer>
      </main>

      {/* Bottom Decorative Items */}
      <div className="floating-item paperclip-bottom" aria-hidden="true">📎</div>
      <div className="floating-item binder-clip-bottom" aria-hidden="true">📌</div>
    </div>
  );
};

export default HomePage;