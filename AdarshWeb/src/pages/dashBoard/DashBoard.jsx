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
  Biology: <Activity size={22} />,
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
      const board = localStorage.getItem("board");
      const classLevel = localStorage.getItem("classLevel");

      if (!token) {
        navigate("/login");
        return;
      }

      const userRes = await fetch(`${API_BASE_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();
      setUserInfo(userData);

      const subjectList = ["physics", "chemistry", "mathematics", "Biology"];

      const finalData = await Promise.all(
        subjectList.map(async (sub) => {
          const syllabusRes = await fetch(
            `${API_BASE_URL}/api/syllabus/${userData.classLevel}/${userData.board.toLowerCase()}/${sub}`,
          );
          const syllabus = await syllabusRes.json();

          return {
            name: syllabus.subject || syllabus.name || sub.toUpperCase(),
            slug: sub,
            totalChapters:
              syllabus.chapters?.length || syllabus.units?.length || 0,
            completedChapters: 0,
            color:
              sub === "physics"
                ? "#4F46E5"
                : sub === "chemistry"
                  ? "#D946EF"
                  : sub === "mathematics"
                    ? "#0EA5E9"
                    : "#10B981",
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

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <div className="dashboard-header">
        <button className="icon-btn" onClick={() => navigate("/home")}>
          <ArrowLeft />
        </button>

        <span className="header-title">
          {userInfo?.board} • Class {userInfo?.classLevel}
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
        const progress = Math.round(
          (item.completedChapters / item.totalChapters) * 100,
        );

        return (
          <div
            key={item.slug}
            className="subject-card"
            onClick={() =>
              navigate(
                `/chapter/${userInfo.classLevel}/${userInfo.board.toLowerCase()}/${item.slug}`,
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
