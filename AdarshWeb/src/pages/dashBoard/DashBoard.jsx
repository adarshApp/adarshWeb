import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashBoard.css";
import {
  ArrowLeft,
  User,
  FileText,
  Compass,
  Layers,
  PenTool,
  Zap,
  Beaker,
  Divide,
  Activity,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

/* ---------- ICON MAP ---------- */
const subjectIcons = {
  physics: <Zap size={22} />,
  chemistry: <Beaker size={22} />,
  mathematics: <Divide size={22} />,
  biology: <Activity size={22} />,
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

      // 1. Fetch live user profile configuration matching mobile backend structure
      const userRes = await fetch(`${API_BASE_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();
      
      const userProfile = userData.user || userData;
      setUserInfo(userProfile);

      // 2. Extract profile fields matching cross-platform keys
      const board = userProfile.board || localStorage.getItem("board");
      const className = userProfile.className || localStorage.getItem("className");

      if (!board || !className) {
        navigate("/onboarding", { replace: true });
        return;
      }

      // Ordered precisely to match your native system parameters
      const subjectList = ["mathematics", "physics", "biology", "chemistry"];

      // 3. Coordinate parallel pipeline queries
      const finalData = await Promise.all(
        subjectList.map(async (sub) => {
          try {
            const syllabusRes = await fetch(
              `${API_BASE_URL}/api/syllabus/${className}/${board.toLowerCase()}/${sub}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const syllabus = await syllabusRes.json();

            // Establish strict title normalization logic
            let displayTitle = sub.charAt(0).toUpperCase() + sub.slice(1);
            if (syllabus.subject || syllabus.name) {
              displayTitle = syllabus.subject || syllabus.name;
            }

            // Sync color constants directly to match your setup
            let cardColor = "#7EC8FF"; // default chemistry blue
            if (sub === "mathematics") cardColor = "#FF7D6A";
            else if (sub === "physics") cardColor = "#D9FFB5";
            else if (sub === "biology") cardColor = "#D9D1FF";

            return {
              name: displayTitle,
              slug: sub,
              totalChapters:
                syllabus.chapters?.length || syllabus.units?.length || 0,
              completedChapters: 0, // Fallback placeholder mirroring mobile storage structures
              color: cardColor,
            };
          } catch (fetchErr) {
            console.error(`Error fetching syllabus for ${sub}:`, fetchErr);
            return {
              name: sub.charAt(0).toUpperCase() + sub.slice(1),
              slug: sub,
              totalChapters: 0,
              completedChapters: 0,
              color: "#666",
            };
          }
        })
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

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <div className="dashboard-header">
        <button className="icon-btn" onClick={() => navigate("/home")}>
          <ArrowLeft />
        </button>

        <span className="header-title">
          {userInfo?.board} • Class {userInfo?.className}
        </span>

        <button className="icon-btn" onClick={() => navigate("/profile")}>
          <User />
        </button>
      </div>

      {/* ACTION GRID */}
      <div className="action-grid">
        <ActionItem
          label="Sample paper"
          icon={<FileText />}
          onClick={() => navigate("/sample-paper")}
        />
        <ActionItem
          label="Roadmap"
          icon={<Compass />}
          onClick={() => navigate("/roadmap")}
        />
        <ActionItem
          label="Cards"
          icon={<Layers />}
          onClick={() => navigate("/flashcards")}
        />
        <ActionItem
          label="Tests"
          icon={<PenTool />}
          onClick={() => navigate("/exam")}
        />
      </div>

      {/* SUBJECT CARDS */}
      {subjects.map((item) => {
        const progress = item.totalChapters > 0 
          ? Math.round((item.completedChapters / item.totalChapters) * 100)
          : 0;

        return (
          <div
            key={item.slug}
            className="subject-card"
            onClick={() =>
              navigate(
                `/chapter/${userInfo?.className}/${userInfo?.board?.toLowerCase()}/${item.slug}`,
              )
            }
          >
            <div className="subject-row">
              <div
                className="subject-icon"
                style={{ background: item.color + "20", color: item.color }}
              >
                {subjectIcons[item.slug]}
              </div>

              <div className="subject-info">
                <h3>{item.name}</h3>
                <p>
                  {item.completedChapters}/{item.totalChapters} Units Completed
                </p>
              </div>

              <span style={{ color: item.color }} className="percent">
                {progress}%
              </span>
            </div>

            <div className="progress-bg">
              <div
                className="progress-fill"
                style={{
                  width: `${progress}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- ACTION ITEM ---------- */
function ActionItem({ label, icon, onClick }) {
  return (
    <div className="action-item" onClick={onClick}>
      <div className="action-icon">{icon}</div>
      <span>{label}</span>
    </div>
  );
}