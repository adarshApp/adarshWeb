import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashBoard.css"; 
import {
  User,
  FileText,
  Map,
  Calendar,
  Brain,
  Trophy,
  Bot,
  Flame,
  Calculator,
  Atom,
  Dna,
  BookOpen,
  LogOut,
  LayoutDashboard
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

/* ---------- ICON MAPS (Black for high-contrast visibility) ---------- */
const toolIcons = {
  "Notes AI": <FileText size={24} color="#000" />,
  "Roadmaps": <Map size={24} color="#000" />,
  "Daily Tracker": <Calendar size={24} color="#000" />,
  "Flash Quiz": <Brain size={24} color="#000" />,
  "Mock Tests": <Trophy size={24} color="#000" />,
  "AI Tutor": <Bot size={24} color="#000" />,
};

const subjectIcons = {
  mathematics: <Calculator size={28} color="#000" />,
  physics: <Atom size={28} color="#000" />,
  biology: <Dna size={28} color="#000" />,
  chemistry: <BookOpen size={28} color="#000" />,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const userRes = await fetch(`${API_BASE_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();
      setUserInfo(userData);

      const subjectList = ["mathematics", "physics", "biology", "chemistry"];

      const finalData = await Promise.all(
        subjectList.map(async (sub) => {
          try {
            const syllabusRes = await fetch(
              `${API_BASE_URL}/api/syllabus/${userData.classLevel}/${userData.board.toLowerCase()}/${sub}`,
            );
            const syllabus = await syllabusRes.json();

            // Saturated blocky colors for background grids
            const colorMap = {
              mathematics: "#FF7D6A",
              physics: "#B8FF5A", 
              biology: "#D9D1FF",
              chemistry: "#7EC8FF",
            };

            return {
              name: syllabus.subject || syllabus.name || sub.charAt(0).toUpperCase() + sub.slice(1),
              slug: sub,
              totalChapters: syllabus.chapters?.length || syllabus.units?.length || 15,
              completedChapters: 3, 
              color: colorMap[sub] || "#FFF",
            };
          } catch (e) {
            return {
              name: sub.charAt(0).toUpperCase() + sub.slice(1),
              slug: sub,
              totalChapters: 15,
              completedChapters: 3,
              color: "#FFF"
            };
          }
        }),
      );

      setSubjects(finalData);
    } catch (err) {
      console.log("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="dashboard-center">
        <div className="loader" />
      </div>
    );
  }

  const tools = [
    { title: "Notes AI", path: "/notes/NotesScreen" },
    { title: "Roadmaps", path: "/roadmap" },
    { title: "Daily Tracker", path: "/tracker/DailyTrackerScreen" },
    { title: "Flash Quiz", path: "/flashcards" },
    { title: "Mock Tests", path: "/exam" },
    { title: "AI Tutor", path: "/tutor" },
  ];

  return (
    <div className="bold-dashboard-layout">
      
      {/* FLOATING DECORATIVE BACKGROUND VOXELS */}
      <span className="voxel-item v-atom">⚛️</span>
      <span className="voxel-item v-book">📚</span>
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="bold-sidebar">
        <div className="sidebar-logo">
          <LayoutDashboard size={20} color="#000" />
          <span>PORTAL</span>
        </div>
        
        <nav className="sidebar-links">
          <button className="side-link active">DASHBOARD</button>
          <button className="side-link" onClick={() => navigate("/profile")}>PROFILE</button>
          <button className="side-link" onClick={() => navigate("/roadmap")}>MY ROADMAP</button>
        </nav>

        <div className="sidebar-bottom">
          <button className="logout-pill-btn" onClick={handleLogout}>
            <LogOut size={16} /> LOG OUT
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER CONTENT */}
      <main className="bold-main-viewport">
        
        {/* TOP BAR BRAND ROW */}
        <header className="bold-dashboard-header">
          <div>
            <h1 className="welcome-heading">
              Hey, <span className="italic-accent">{userInfo?.name || "Student"}</span>!
            </h1>
            <p className="welcome-sub">Here is your academic command station for today.</p>
          </div>
          
          <div className="header-badge-action" onClick={() => navigate("/profile")}>
            <div className="avatar-box">
              {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : <User size={16} />}
            </div>
            <span>{userInfo?.email || "STUDENT ACCOUNT"}</span>
          </div>
        </header>

        {/* 3-COLUMN HERO STATS CARD BLOCK */}
        <section className="section-block">
          <div className="hero-feature-grid">
            
            {/* Flashcards Target */}
            <div className="bold-stat-card yellow-accent" onClick={() => navigate("/flashcards")}>
              <span className="card-micro-badge">READY</span>
              <h2 className="card-main-title">Flashcards</h2>
              <p className="card-description-text">124 Decks available to test retention.</p>
              <button className="card-action-trigger">START LEARNING →</button>
            </div>

            {/* Streak Counter */}
            <div className="bold-stat-card black-accent">
              <div className="card-row-header">
                <span className="card-micro-badge yellow-accent">STREAK</span>
                <Flame size={24} color="#ffee00" />
              </div>
              <h2 className="card-main-title light-text">18 Days Running</h2>
              <p className="card-description-text light-text">Keep your learning momentum burning.</p>
            </div>

            {/* Target Goal Roadmap */}
            <div className="bold-stat-card blue-accent" onClick={() => navigate("/roadmap")}>
              <span className="card-micro-badge white-bg">TARGET</span>
              <h2 className="card-main-title light-text">{userInfo?.board || "JEE"} Roadmap</h2>
              <p className="card-description-text light-text">78% completed this active month cycle.</p>
            </div>

          </div>
        </section>

        {/* DOUBLE COLUMN LAYOUT ENGINE */}
        <div className="two-column-workspace">
          
          {/* CONTENT COLLATERAL (LEFT PANEL) */}
          <div className="workspace-left">
            
            {/* TOOLS GRID SECTION */}
            <section className="section-block">
              <h2 className="bold-block-label">STUDY TOOLS</h2>
              <div className="tools-brutalist-grid">
                {tools.map((tool, index) => (
                  <div key={index} className="tool-brutalist-card" onClick={() => navigate(tool.path)}>
                    <div className="tool-icon-square">{toolIcons[tool.title]}</div>
                    <span className="tool-title-label">{tool.title}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* SYLLABUS PANEL SECTION */}
            <section className="section-block">
              <h2 className="bold-block-label">YOUR SYLLABUS</h2>
              <div className="syllabus-brutalist-grid">
                {subjects.map((item) => (
                  <div
                    key={item.slug}
                    className="subject-brutalist-card"
                    style={{ backgroundColor: item.color }}
                    onClick={() => navigate(`/chapter/${userInfo?.classLevel}/${userInfo?.board?.toLowerCase()}/${item.slug}`)}
                  >
                    <div className="subject-header-row">
                      <span className="subject-title-text">{item.name}</span>
                      {subjectIcons[item.slug] || <BookOpen size={24} color="#000" />}
                    </div>
                    <div className="subject-footer-pill">
                      <span>{item.completedChapters} / {item.totalChapters} CHAPTERS</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* KPI SIDEBAR REGION (RIGHT PANEL) */}
          <div className="workspace-right">
            <section className="section-block sticky-card-holder">
              <h2 className="bold-block-label">YOUR PROGRESS</h2>
              <div className="progress-brutalist-card">
                <span className="card-micro-badge blue-accent-badge">GOAL KPI</span>
                <h3 className="progress-card-header">Weekly Status</h3>
                
                <p className="progress-numerical-readout">12 / 20 Chapters Finished</p>
                
                <div className="brutalist-progress-track">
                  <div className="brutalist-progress-fill" style={{ width: "60%" }} />
                </div>

                <div className="neo-insights-box">
                  <span className="insight-title">METRIC INSIGHTS:</span>
                  <p>Finish 2 remaining chapters of Chemistry to hit your weekly target line.</p>
                </div>
              </div>
            </section>
          </div>

        </div>
      </main>
    </div>
  );
}