import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./subjectResources.css";
import { ChevronLeft, ArrowRight } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function SubjectResources() {
  const navigate = useNavigate();
  const { classLevel, board, subject } = useParams();

  const [subjectData, setSubjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSubject = useCallback(async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const res = await fetch(
        `${API_BASE_URL}/api/syllabus/${classLevel}/${board}/${subject}`,
        { headers }
      );

      if (!res.ok) throw new Error("Syllabus not found");

      const data = await res.json();
      setSubjectData(data);
      setError("");
    } catch (err) {
      setError("Resource unavailable");
      setSubjectData(null);
    } finally {
      setLoading(false);
    }
  }, [classLevel, board, subject]);

  useEffect(() => {
    fetchSubject();
  }, [fetchSubject]);

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <div className="sr-center">
        <div className="loader" />
        <p>Syncing Curriculum...</p>
      </div>
    );
  }

  /* ---------- ERROR ---------- */
  if (error || !subjectData) {
    return (
      <div className="sr-center">
        <p className="sr-error">Resource unavailable</p>
        <button className="retry-btn" onClick={fetchSubject}>
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="sr-container">
      {/* HEADER */}
      <div className="sr-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft />
        </button>

        <h1>{subjectData.subject}</h1>
        <p>
          Class {classLevel} • {subjectData.board.toUpperCase()}
        </p>
      </div>

      {/* CHAPTER GRID */}
      <div className="chapter-grid">
        {subjectData.chapters.map((item) => (
          <div
            key={item.id}
            className="chapter-card"
            onClick={() =>
             navigate(`/chapter/${classLevel}/${board}/${subject}/${item.file}`)
            }
          >
            <span className="unit-badge">UNIT {item.unit}</span>

            <h3>{item.title}</h3>

            <div className="card-footer">
              <span>Open Lesson</span>
              <ArrowRight size={14} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}