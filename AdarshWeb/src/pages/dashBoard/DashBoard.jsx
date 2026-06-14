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
  BookOpen
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

/* ---------- ICON MAPS (To Match Mobile Styling) ---------- */
const toolIcons = {
  "Notes AI": <FileText size={24} color="#B8FF5A" />,
  "Roadmaps": <Map size={24} color="#B8FF5A" />,
  "Daily Tracker": <Calendar size={24} color="#B8FF5A" />,
  "Flash Quiz": <Brain size={24} color="#B8FF5A" />,
  "Mock Tests": <Trophy size={24} color="#B8FF5A" />,
  "AI Tutor": <Bot size={24} color="#B8FF5A" />,
};

const subjectIcons = {
  mathematics: <Calculator size={32} color="#000" />,
  physics: <Atom size={32} color="#000" />,
  biology: <Dna size={32} color="#000" />,
  chemistry: <BookOpen size={32} color="#000" />,
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
          const syllabusRes = await fetch(
            `${API_BASE_URL}/api/syllabus/${userData.classLevel}/${userData.board.toLowerCase()}/${sub}`,
          );
          const syllabus = await syllabusRes.json();

          // Match React Native colors exactly
          const colorMap = {
            mathematics: "#FF7D6A",
            physics: "#D9FFB5",
            biology: "#D9D1FF",
            chemistry: "#7EC8FF",
          };

          return {
            name: syllabus.subject || syllabus.name || sub.charAt(0).toUpperCase() + sub.slice(1),
            slug: sub,
            totalChapters: syllabus.chapters?.length || syllabus.units?.length || 15, // Fallback placeholder
            completedChapters: 3, // Fallback placeholder to match 12/20 (60%) mobile preview total
            color: colorMap[sub] || "#FFF",
          };
        }),
      );

      setSubjects(finalData);
    } catch (err) {
      console.log("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="dashboard-center">
        <div className="loader" />
      </div>
    );
  }

  // Study tools structure mapping to your router paths
  const tools = [
    { title: "Notes AI", path: "/notes/NotesScreen" },
    { title: "Roadmaps", path: "/roadmap" },
    { title: "Daily Tracker", path: "/tracker/DailyTrackerScreen" },
    { title: "Flash Quiz", path: "/flashcards" },
    { title: "Mock Tests", path: "/exam" },
    { title: "AI Tutor", path: "/tutor" },
  ];

  return (
    <div className="mobile-viewport-container">
      <div className="mobile-scroll-wrapper">
        
        {/* HEADER */}
        <div className="mobile-header">
          <span className="mobile-title">Discover</span>
          <button className="profile-btn" onClick={() => navigate("/profile")}>
            <User size={20} color="#FFF" />
          </button>
        </div>

        {/* HERO CARDS (Horizontal Scroll) */}
        <div className="hero-scroll-container">
          {/* Flashcards Hero */}
          <div 
            className="hero-card bright-card" 
            onClick={() => navigate("/flashcards")}
          >
            <h2 className="hero-title">Flashcards</h2>
            <p className="hero-sub">124 Cards Available</p>
            <div className="hero-btn">
              <span className="hero-btn-text">Start Learning</span>
            </div>
          </div>

          {/* Streak Hero */}
          <div className="hero-card dark-card">
            <Flame size={28} color="#B8FF5A" />
            <h2 className="dark-hero-title">18 Day Streak</h2>
            <p className="dark-hero-sub">Keep your learning momentum alive.</p>
          </div>

          {/* Roadmap Hero */}
          <div className="hero-card dark-card" onClick={() => navigate("/roadmap")}>
            <Map size={28} color="#B8FF5A" />
            <h2 className="dark-hero-title">{userInfo?.board || "JEE"} Roadmap</h2>
            <p className="dark-hero-sub">78% completed this month.</p>
          </div>
        </div>

        {/* STUDY TOOLS SECTION */}
        <h2 className="section-heading">Study Tools</h2>
        <div className="tools-grid">
          {tools.map((tool, index) => (
            <div 
              key={index} 
              className="tool-card" 
              onClick={() => navigate(tool.path)}
            >
              <div className="tool-icon-wrapper">
                {toolIcons[tool.title]}
              </div>
              <span className="tool-text">{tool.title}</span>
            </div>
          ))}
        </div>

        {/* SYLLABUS SECTION */}
        <h2 className="section-heading">Your syllabus</h2>
        <div className="subject-grid">
          {subjects.map((item) => (
            <div
              key={item.slug}
              className="subject-card-mobile"
              style={{ backgroundColor: item.color }}
              onClick={() => navigate(`/chapter/${userInfo.classLevel}/${userInfo.board.toLowerCase()}/${item.slug}`)}
            >
              <span className="subject-title-mobile">{item.name}</span>
              {subjectIcons[item.slug] || <BookOpen size={32} color="#000" />}
            </div>
          ))}
        </div>

        {/* PROGRESS CARD */}
        <h2 className="section-heading">Your Progress</h2>
        <div className="progress-card-mobile">
          <h3 className="progress-title-mobile">Weekly Goal</h3>
          <p className="progress-text-mobile">12 / 20 Chapters Completed</p>
          <div className="progress-bar-bg-mobile">
            <div className="progress-bar-fill-mobile" style={{ width: "60%" }} />
          </div>
        </div>

        {/* Bottom padding spacing matching native */}
        <div style={{ height: "100px" }} />
      </div>
    </div>
  );
}