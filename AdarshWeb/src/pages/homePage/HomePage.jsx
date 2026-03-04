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

  // Helper to generate calendar days
  const generateCalendar = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Fill initial empty slots for the grid
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="cal-day empty"></div>);
    }
    // Fill actual dates
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === now.getDate();
      days.push(
        <div key={d} className={`cal-day ${isToday ? 'today' : ''}`}>
          {d}
        </div>
      );
    }
    return days;
  };

  const monthName = new Date().toLocaleString('default', { month: 'long' });
  const yearName = new Date().getFullYear();

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
            Learn  <span className="italic-accent">Without Limit. </span> <br /> 
             ⚡
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
          {/* Functional Calendar Card */}
          <div className="feature-voxel-card calendar-card">
            <div className="card-badge">STUDY TRACKER</div>
            <h2 className="calendar-header">{monthName} {yearName}</h2>
            
            <div className="calendar-grid-header">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
            
            <div className="calendar-grid">
              {generateCalendar()}
            </div>

            <div className="card-stats-footer">
              <span className="stat-pill">Daily Goal: 8h</span>
              <span className="stat-pill">Streak: 5🔥</span>
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