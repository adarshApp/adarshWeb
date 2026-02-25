import "./header.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

export default function Header() {
  const navigate = useNavigate();

  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(window.scrollY);

  // Hide / Show header on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current) {
        setShowHeader(false); // scrolling down → hide
      } else {
        setShowHeader(true); // scrolling up → show
      }
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className={`home-header glass ${showHeader ? "show" : "hide"}`}>
      
      {/* LOGO */}
      <div className="header-logo" onClick={() => navigate("/home")}>
        Adarsh
      </div>

      {/* NAVIGATION */}
      <nav className="header-nav">
        <Link to="/home">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/exam-dashboard">Tests</Link>
        <Link to="/home#resources">Resources</Link>
      </nav>

      {/* ACTIONS */}
      <div className="header-actions">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

    </header>
  );
}