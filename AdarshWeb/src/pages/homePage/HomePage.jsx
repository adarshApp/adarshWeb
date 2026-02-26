import React, { useState, useEffect } from 'react';
import './homePage.css';

const HomePage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time for the digital display
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bold-container">
      {/* 3D Floating Voxel Elements */}
      <div className="voxel-item v-atom">⚛️</div>
      <div className="voxel-item v-book">📚</div>
      <div className="voxel-item v-pi">π</div>
      <div className="voxel-item v-lab">🧪</div>

      <nav className="bold-nav">
        <div className="nav-logo">ADARSH</div>
        <div className="nav-links">
          <span>JEE/NEET</span>
          <span>RESOURCES</span>
          <span>BOARDS</span>
        </div>
        <button className="nav-btn-black">CONTACT</button>
      </nav>

      <main className="bold-hero-grid">
        <section className="hero-text-content">
          <h1 className="hero-main-title">
            Fresh & <span className="italic-accent">bold</span> <br /> 
            study graphics.
          </h1>
          
          <p className="hero-subtext">
            Each study piece is thoughtfully crafted to work with current exam 
            patterns like floating elements, layered PDF compositions, and 
            dynamic student micro-interactions.
          </p>

          <div className="hero-action-row">
            <button className="explore-pill-btn">EXPLORE MORE</button>
            <div className="bold-clock-display">
              {formatTime(currentTime)}
            </div>
          </div>
        </section>

        <section className="hero-visual-card-area">
          {/* The High-Contrast Voxel Card */}
          <div className="feature-voxel-card">
            <div className="card-badge">TOP RATED</div>
            <h2 className="card-title">Physics: <br/> Electromagnetics</h2>
            <p className="card-description">
              Master complex Maxwell equations with our new 3D visualization modules.
            </p>
            <div className="card-stats-footer">
              <span className="stat-pill">15 Modules</span>
              <span className="stat-pill">4.9 ★</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="bold-site-footer">
        <div className="footer-line"></div>
        <p>Managed by <strong>Nanotech Labs</strong> — VSSUT Burla</p>
      </footer>
    </div>
  );
};

export default HomePage;