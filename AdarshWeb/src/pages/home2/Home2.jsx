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

/* -------- Greeting Logic -------- */
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

  const goTo = (route) => {
    navigate(route);
  };

  if (loadingUser) {
    return (
      <div className="home-center">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* ===== TOP BAR ===== */}
      <div className="top-bar">
        <div>
          <p className="greeting">{getGreeting()},</p>
          <h2 className="username">{user?.name || "Guest User"}</h2>
        </div>

        <button className="profile-circle" onClick={() => goTo("/profile")}>
          <User size={22} />
        </button>
      </div>

      {/* ===== HERO ===== */}
      <div className="hero-card">
        <h3>Your Study Room</h3>
        <p>Continue where you left off today.</p>

        <button className="hero-btn" onClick={() => goTo("/dashboard")}>
          Enter Room <ChevronRight size={16} />
        </button>
      </div>

      {/* ===== QUICK ACCESS ===== */}
      <h3 className="section-title">Quick Access</h3>

      <div className="grid">
        <MenuCard
          icon={<Trophy color="#4F46E5" />}
          title="Rank Predictor"
          desc="Check Potential"
          onClick={() => goTo("/rank-predictor")}
        />

        <MenuCard
          icon={<FileText color="#EA580C" />}
          title="Cheat Sheet"
          desc="Formulas"
          onClick={() => goTo("/cheat-sheet")}
        />

        <MenuCard
          icon={<Zap color="#DB2777" />}
          title="Flashcards"
          desc="Quick Review"
          onClick={() => goTo("/flashcards")}
        />

        <MenuCard
          icon={<PenTool color="#16A34A" />}
          title="Take Test"
          desc="Practice Now"
          onClick={() => goTo("/take-test")}
        />

        <MenuCard
          icon={<Target color="#475569" />}
          title="Track Exam"
          desc="Stay Updated"
          onClick={() => goTo("/track-exam")}
        />

        <MenuCard
          icon={<Lightbulb color="#D97706" />}
          title="Daily Quiz"
          desc="Snapshot"
          onClick={() => goTo("/daily-quiz")}
        />
      </div>

      {/* ===== PYQ ===== */}
      <div className="full-card" onClick={() => goTo("/exam")}>
        <BookOpen size={22} color="#7C3AED" />
        <div className="full-card-text">
          <h4>Access All Exam PYQ</h4>
          <p>Chapter wise PYQ Bank</p>
        </div>
        <ChevronRight />
      </div>
    </div>
  );
}

/* -------- Menu Card -------- */
function MenuCard({ icon, title, desc, onClick }) {
  return (
    <div className="menu-card" onClick={onClick}>
      <div className="icon-circle">{icon}</div>
      <h4>{title}</h4>
      <p>{desc}</p>
    </div>
  );
}