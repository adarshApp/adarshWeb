import "./dashBoard.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Header from "../header/Header";


export default function Dashboard() {
  const navigate = useNavigate();

  const [board, setBoard] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [progressData, setProgressData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD USER ================= */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Unauthorized");

        const user = await res.json();

        if (!user.board || !user.classLevel) {
          navigate("/choose-board");
          return;
        }

        setBoard(user.board);
        setClassLevel(user.classLevel);
        setProgressData(user.progress || []);
      } catch {
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  /* ================= LOAD PROGRESS LIVE ================= */
  useEffect(() => {
    const fetchProgress = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;

      const data = await res.json();
      setProgressData(data || []);
    };

    // Initial load
    fetchProgress();

    // ✅ Listen when chapter marked completed
    window.addEventListener("progressUpdated", fetchProgress);

    return () => {
      window.removeEventListener("progressUpdated", fetchProgress);
    };
  }, []);

  /* ================= LOAD SUBJECTS ================= */
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!board || !classLevel) return;

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/syllabus/${classLevel}/${board}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) {
        setLoading(false);
        return;
      }

      const data = await res.json();
      setSubjects(data.subjects || []);
      setLoading(false);
    };

    fetchSubjects();
  }, [board, classLevel]);

  /* ================= SUBJECT ICONS ================= */
  const subjectIcons = {
    physics: "⚡",
    chemistry: "⚗️",
    mathematics: "📐",
    biology: "🧬",
    english: "📘",
  };

  /* ================= PROGRESS HELPERS ================= */
  const getCount = (slug, totalChapters) => {
    const subjectProgress = progressData.find((s) => s.subject === slug);
    const completed = subjectProgress?.completedChapters.length || 0;
    return `${completed} / ${totalChapters}`;
  };

  const getProgress = (slug, totalChapters) => {
    const subjectProgress = progressData.find((s) => s.subject === slug);
    const completed = subjectProgress?.completedChapters.length || 0;
    return Math.round((completed / totalChapters) * 100);
  };

  /* ================= EXAM COUNTDOWN ================= */
  const examDates = {
    CBSE: { 10: "2026-03-15", 12: "2026-03-10" },
    CHSE: { 12: "2026-03-20" },
  };

  const getDaysLeft = () => {
    const date = examDates?.[board]?.[classLevel];
    if (!date) return null;
    return Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return <div style={{ padding: "100px" }}>Loading dashboard...</div>;
  }

  /* ================= UI (UNCHANGED) ================= */
  return (
    <div className="dashboard-wrapper">
      <Header />

      {/* ================= OVERVIEW ================= */}
      <section className="dashboard-overview glass">
        <div>
          <h1>
            {board} • Class {classLevel} <span>Board Exam</span>
          </h1>
          <p className="overview-subtext">
            Track syllabus, monitor progress, and stay exam-ready
          </p>
        </div>

        <div className="countdown-card">
          {getDaysLeft() !== null ? (
            <>
              <strong>{getDaysLeft()}</strong>
              <span>days left</span>
            </>
          ) : (
            <>
              <strong>—</strong>
              <span>exam not set</span>
            </>
          )}
        </div>
      </section>

      {/* ================= MAIN GRID ================= */}
      <section className="dashboard-grid">
        {/* 📚 SYLLABUS */}
        <div className="syllabus-card glass">
          <h2>Syllabus Progress</h2>

          {subjects.map((subject) => (
            <div
              key={subject.slug}
              className="subject clickable"
              onClick={() =>
                navigate(`/class/${classLevel}/${board}/${subject.slug}`)
              }
            >
              <span>
                {subjectIcons[subject.slug] || "📘"} {subject.name}
              </span>

              <small>{getCount(subject.slug, subject.totalChapters)}</small>
              <CircularProgress
                percent={getProgress(subject.slug, subject.totalChapters)}
              />
            </div>
          ))}
        </div>

        {/* 🚀 QUICK LEARNING (UNCHANGED UI) */}
        <div className="streak-card glass">
          <h2>Quick Learning</h2>
          <p className="streak-count">Boost your preparation</p>

          <div className="learning-actions">
            <button className="action-btn pyq" onClick={() => navigate("/pyq")}>
              📄 PYQs
              <span>Previous Year Questions</span>
            </button>

            <button
              className="action-btn roadmap"
              onClick={() => navigate("/roadmap")}
            >
              🧭 Roadmap
              <span>Step-by-step plan</span>
            </button>

            <button
              className="action-btn flashcard"
              onClick={() => navigate("/flashcards")}
            >
              🧠 Flashcards
              <span>Quick revision</span>
            </button>

            <button
              className="action-btn sample"
              onClick={() => navigate("/sample-papers")}
            >
              📝 Sample Papers
              <span>Exam practice</span>
            </button>

            <button
              className="action-btn tests"
              onClick={() => navigate("/tests")}
            >
              📝 Tests
              <span>Exam practice</span>
            </button>

            <button
              className="action-btn shortnotes"
              onClick={() => navigate("/shortnotes")}
            >
              📝 Short Notes
              <span>Exam practice</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= ANALYTICS ================= */}
      <section className="glass" style={{ marginTop: "40px" }}>
        <AnalyticsChart subjects={subjects} getProgress={getProgress} />
      </section>

      {/* ================= ACTION ================= */}
      <section className="dashboard-action">
        <button
          className="take-test-btn"
          onClick={() => navigate("/exam-dashboard")}
        >
          Take a Test
        </button>
      </section>
    </div>
  );
}