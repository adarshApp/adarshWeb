import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home2.css";
import {
  ChevronRight,
  User,
  Trophy,
  Zap,
  FileText,
  PenTool,
  Target,
  Lightbulb,
  BookOpen,
} from "lucide-react";
import { API_BASE_URL } from "../../config/api";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 21) return "Good Evening";
  return "Good Night";
}

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const token = localStorage.getItem("token");
      const guestId = localStorage.getItem("guestId");
      if (guestId) {
        const guestName = localStorage.getItem("guestName");
        setUser({ name: guestName || "Guest User" });
        return;
      }
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }
      const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (err) {
      console.error("User load error:", err);
    } finally {
      setLoadingUser(false);
    }
  }

  const goTo = (route) => navigate(route);

  if (loadingUser) {
    return (
      <div className="home-center">
        <div className="custom-loader"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      {/* Background Decorative Voxels */}
      <div className="bg-voxel v1">⚛️</div>
      <div className="bg-voxel v2">📚</div>

      {/* ===== HEADER ===== */}
      <header className="dashboard-header">
        <div className="user-info">
          <p className="greeting-text">{getGreeting()},</p>
          <h2 className="display-name">{user?.name || "Student"}</h2>
        </div>
        <button className="avatar-btn" onClick={() => goTo("/profile")}>
          <User size={24} strokeWidth={2.5} />
        </button>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="hero-banner" onClick={() => goTo("/dashboard")}>
        <div className="hero-content">
          <span className="badge">LIVE SESSION</span>
          <h3>Your Study Room</h3>
          <p>Continue your JEE prep where you left off.</p>
        </div>
        <div className="hero-icon-box">
          <ChevronRight size={32} />
        </div>
      </section>

      {/* ===== GRID ACCESS ===== */}
      <h3 className="section-label">Quick Actions</h3>
      <div className="feature-grid">
        <MenuCard
          icon={<Trophy size={28} />}
          title="Rank Predictor"
          desc="Check Potential"
          color="#4F46E5"
          onClick={() => goTo("/rank-predictor")}
        />
        <MenuCard
          icon={<FileText size={28} />}
          title="Cheat Sheet"
          desc="Quick Formulas"
          color="#EA580C"
          onClick={() => goTo("/cheat-sheet")}
        />
        <MenuCard
          icon={<Zap size={28} />}
          title="Flashcards"
          desc="Speed Review"
          color="#DB2777"
          onClick={() => goTo("/flashcards")}
        />
        <MenuCard
          icon={<PenTool size={28} />}
          title="Take Test"
          desc="Mock Exam"
          color="#16A34A"
          onClick={() => goTo("/take-test")}
        />
      </div>

      {/* ===== LARGE ACTION CARD ===== */}
      <div className="pyq-full-card" onClick={() => goTo("/exam")}>
        <div className="pyq-icon">
          <BookOpen size={28} />
        </div>
        <div className="pyq-text">
          <h4>Access All Exam PYQs</h4>
          <p>Chapter-wise bank for JEE & NEET</p>
        </div>
        <div className="pyq-arrow">
          <ChevronRight />
        </div>
      </div>
    </div>
  );
}

function MenuCard({ icon, title, desc, onClick, color }) {
  return (
    <div className="action-card" onClick={onClick} style={{ "--hover-color": color }}>
      <div className="card-icon" style={{ color: color }}>{icon}</div>
      <div className="card-info">
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
    </div>
  );
}